import App from "./app/app";
import { Configuration } from "./app/configuration";
import Console from "./utils/console";
import 'reflect-metadata';

try{   

    const config = new Configuration(__dirname, 1244, "localhost");

    const application : App = new App(config);

    application.StartServer(configs =>
    {
        Console.Info(`Server running on ${configs.IP}:${configs.Port}`);       
        
    })
    

}catch(ex)
{
    Console.Error((ex as Error));
}
    