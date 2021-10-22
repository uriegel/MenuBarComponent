using System;
using UwebServer;
using UwebServer.Routes;

var port = 9884;

var routeWebSite = new Static() { FilePath = "." };
var server = new Server(new()
{
    Port = port,
    Routes = new[] { routeWebSite },
});
server.Start();
Console.WriteLine($"Running test server on http://localhost:{port}/test/index.html");
Console.ReadLine();


