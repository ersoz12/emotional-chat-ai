FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish
WORKDIR /app/publish
EXPOSE 8080
ENTRYPOINT ["dotnet", "Api.dll"]