using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Api
{
    public class SentimentClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public SentimentClient(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _baseUrl = config["Sentiment:BaseUrl"];
        }

        public async Task<SentimentResult> AnalyzeAsync(string text)
        {
            var payload = new { data = new[] { text } };
            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_baseUrl}/api/analyze", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            try
            {
                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("data", out var dataEl) && dataEl.ValueKind == JsonValueKind.Array && dataEl.GetArrayLength() > 0)
                {
                    var first = dataEl[0];
                    var label = first.GetProperty("label").GetString() ?? "unknown";
                    var score = first.GetProperty("score").GetDouble();
                    return new SentimentResult(label, score, json);
                }
            }
            catch
            {
            }
            return new SentimentResult("unknown", 0.0, json);
        }
    }

    public record SentimentResult(string Label, double Score, string RawJson);
}
