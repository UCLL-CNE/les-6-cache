import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { LinkService } from "../service/link-service";
import { openRouteWrapper } from "../helpers/function-wrapper";
import { LinkCache } from "../repository/redis-link-cache";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {

        context.log('HTTP trigger function processed a request.');

        const mapping = context.bindingData.mapping;
        const linkCache = await LinkCache.getInstance();
        const cachedLink = await linkCache.getLinkMapping(mapping);

        if (cachedLink) {
            context.res = {
                status: 301,
                headers: {
                    "Location": cachedLink,
                    "LEESBARELINK-LOCATION": "cache"
                }
            };
        } else {
            const link = await LinkService.getInstance().getLinkByMapping(mapping);
            await linkCache.setLinkMapping(link, mapping);

            context.res = {
                status: 301,
                headers: {
                    "Location": link,
                    "LEESBARELINK-LOCATION": "db"
                }
            };
        }


        await linkCache.quit();
    }, context)
};

export default httpTrigger;