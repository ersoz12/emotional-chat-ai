using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Api; // SentimentClient sınıfını kullanmak için

var builder = WebApplication.CreateBuilder(args);

// ------------------------------
// CORS (React frontend eri�imi i�in)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// HttpClient ve SentimentClient ekle
builder.Services.AddHttpClient<SentimentClient>();

// EF Core + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("Default"));
});

// Controller gerekmeden basit endpoint�lerle ilerliyoruz
var app = builder.Build();

// ------------------------------
// CORS aktif et
app.UseCors("AllowAll");

// DB ensure created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// ------------------------------
// Basit test endpoint (backend canl� m�?)
app.MapGet("/", () => new { ok = true, service = "backend api" });

// ------------------------------
// Hugging Face AI servisine test (ping)
app.MapGet("/api/ping-hf", async (SentimentClient client) =>
{
    var sample = "Bugün hava çok güzel, mutluyum!";
    var result = await client.AnalyzeAsync(sample);
    return Results.Ok(new { sample, result });
});

// ------------------------------
// Ger�ek analiz endpoint�i
app.MapPost("/api/analyze", async (SentimentClient client, SentimentRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Text))
        return Results.BadRequest(new { error = "Metin boş olamaz" });

    try
    {
        var res = await client.AnalyzeAsync(req.Text);
        return Results.Ok(new { ok = true, text = req.Text, analysis = res });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Hata: {ex.Message}");
    }
});

// Modeller
public class User
{
    public int Id { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

public class Message
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Text { get; set; } = string.Empty;
    public string SentimentLabel { get; set; } = "unknown";
    public double SentimentScore { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users => Set<User>();
    public DbSet<Message> Messages => Set<Message>();
}

// User endpoints
app.MapPost("/api/users", async (AppDbContext db, CreateUserRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Nickname))
        return Results.BadRequest(new { error = "Rumuz boş olamaz" });
    var exists = await db.Users.AnyAsync(u => u.Nickname == req.Nickname);
    if (exists) return Results.Conflict(new { error = "Bu rumuz zaten var" });
    var user = new User { Nickname = req.Nickname };
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok(user);
});

app.MapGet("/api/users", async (AppDbContext db) =>
    Results.Ok(await db.Users.OrderByDescending(u => u.Id).ToListAsync())
);

// Message endpoints
app.MapPost("/api/messages", async (AppDbContext db, SentimentClient client, CreateMessageRequest req) =>
{
    if (req.UserId <= 0) return Results.BadRequest(new { error = "Geçersiz kullanıcı" });
    if (string.IsNullOrWhiteSpace(req.Text)) return Results.BadRequest(new { error = "Mesaj boş olamaz" });
    var user = await db.Users.FindAsync(req.UserId);
    if (user == null) return Results.NotFound(new { error = "Kullanıcı bulunamadı" });
    var analysis = await client.AnalyzeAsync(req.Text);
    var message = new Message
    {
        UserId = req.UserId,
        Text = req.Text,
        SentimentLabel = analysis.Label,
        SentimentScore = analysis.Score,
    };
    db.Messages.Add(message);
    await db.SaveChangesAsync();
    return Results.Ok(message);
});

app.MapGet("/api/messages", async (AppDbContext db, int? userId) =>
{
    var query = db.Messages.AsQueryable();
    if (userId.HasValue) query = query.Where(m => m.UserId == userId.Value);
    var list = await query.OrderByDescending(m => m.Id).Take(200).ToListAsync();
    return Results.Ok(list);
});

app.Run();

// ------------------------------
// Request modeli
public record SentimentRequest(string Text);
public record CreateUserRequest(string Nickname);
public record CreateMessageRequest(int UserId, string Text);
