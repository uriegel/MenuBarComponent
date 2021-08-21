using System;
using UwebServer;
using UwebServer.Routes;

var port = 9888;

var routeWebSite = new Static() { FilePath = "." };
var server = new Server(new()
{
    Port = port,
    Routes = new[] { routeWebSite },
});
server.Start();
Console.WriteLine($"Running test server on http://localhost:{port}");
Console.WriteLine($"Press any key to exit...");
Console.ReadLine();
server.Stop();
Console.WriteLine($"Test server stopped.");



