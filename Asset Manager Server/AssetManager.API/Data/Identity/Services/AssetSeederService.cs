using AssetManager.API.Applications.Interfaces;
using AssetManager.API.Domain.DTOs;
using AssetManager.API.Domain.Entities;
using AssetManager.API.Data;
using Bogus;
using MongoDB.Driver;
using static AssetManager.API.Data.Enums.AssetCategory;

namespace AssetManager.API.Data.Identity.Services;

public class AssetSeederService
{
    private readonly IAssetService _assetService;
    private readonly MongoDbService _mongoDbService;

    private readonly Dictionary<CategoryEnum, string> _imageUrls = new()
    {
        { CategoryEnum.laptop, "https://cdn.mos.cms.futurecdn.net/Gw3Se82bvppoJsHc4rCVsQ.jpg" },
        { CategoryEnum.projector, "https://cdn.mos.cms.futurecdn.net/Hb4raDbPaBqWa3ex3KgudU.jpg" },
        { CategoryEnum.camera, "https://images-na.ssl-images-amazon.com/images/I/61-43nBt6YL.jpg" },
        { CategoryEnum.smartphone, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuPHpSdfNeDZNgHvzwLobDXioZU0qoPJDSsA&s" },
        { CategoryEnum.others, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA2h_eMkWDk62853N970iLjhgA8npiEKb_bA&s" }
    };

    private readonly Dictionary<CategoryEnum, List<string>> _deviceNames = new()
    {
        { CategoryEnum.laptop, new List<string> { "Dell XPS 13", "MacBook Pro", "Lenovo ThinkPad X1", "HP Spectre x360", "Asus ROG Zephyrus" } },
        { CategoryEnum.projector, new List<string> { "Epson Home Cinema 3800", "BenQ HT2050A", "ViewSonic PX701HD", "LG PF50KA", "Optoma HD39HDR" } },
        { CategoryEnum.camera, new List<string> { "Canon EOS R5", "Nikon Z6", "Sony Alpha A6400", "Fujifilm X-T4", "Panasonic Lumix GH5" } },
        { CategoryEnum.smartphone, new List<string> { "iPhone 14 Pro", "Samsung Galaxy S23", "Google Pixel 8", "OnePlus 11", "Xiaomi Mi 13" } },
        { CategoryEnum.others, new List<string> { "Apple Watch Series 9", "Samsung Galaxy Tab S8", "Amazon Echo Dot", "Logitech MX Master 3", "Oculus Quest 2" } }
    };

    public AssetSeederService(IAssetService assetService, MongoDbService mongoDbService)
    {
        _assetService = assetService;
        _mongoDbService = mongoDbService;
    }

    public async Task SeedAssetsAsync()
    {
        var collection = _mongoDbService.Database.GetCollection<Assets>("Assets");

        var count = await collection.CountDocumentsAsync(FilterDefinition<Assets>.Empty);
        if (count > 0)
        {
            return; // Already seeded
        }

        var categories = Enum.GetValues(typeof(CategoryEnum)).Cast<CategoryEnum>().ToList();
        var faker = new Faker();

        var tasks = new List<Task>();

        for (int i = 0; i < 100; i++)
        {
            var category = faker.PickRandom(categories);
            var name = faker.PickRandom(_deviceNames[category]);

            var asset = new AssetDto
            {
                Name = name,
                Description = faker.Commerce.ProductAdjective() + " " + category.ToString().ToLower(),
                Amount = Math.Round(faker.Random.Double(100, 3000), 2),
                Status = true,
                Category = category.ToString(),
                ImageUrl = _imageUrls[category]
            };

            tasks.Add(_assetService.AddAsset(asset));
        }

        await Task.WhenAll(tasks);
    }
}
