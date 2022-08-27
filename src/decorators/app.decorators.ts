import 'reflect-metadata';
import { MetadataKeys } from './validatorHandler';
import {Verb} from '../enums/httpVerbs';


export function InjectController() : (constructor : any) => void
{
    const controllerSymbol = "ow:controller";    
    const routeSymbol = "ow:route";   

    MetadataKeys.ControllerRouterKey = controllerSymbol;
    MetadataKeys.RouterKey = routeSymbol;

    return function controllerDecorator(constructor : any)
    {
        Reflect.defineMetadata(controllerSymbol, true, constructor);
        //Reflect.defineMetadata(routeSymbol, path, constructor);       
    }
    
}
