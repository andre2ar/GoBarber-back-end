import { Request, Response} from "express";
import {container} from "tsyringe";
import ListProvidersService from "@modules/appointments/services/ListProvidersService";
import {classToClass} from "class-transformer";

export default class ProvidersController {
    public async index(request: Request, response: Response): Promise<Response> {
        const listProviders = container.resolve(ListProvidersService);

        const providers = await listProviders.execute(request.user.id);

        return response.json(classToClass(providers));
    }
}
