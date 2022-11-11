import {createClient, Instance} from "@scaleway/sdk";

export {handle};

async function handle(event, context) {
    const body = JSON.parse(event.body);

    if(!body.action) return {statusCode: 400, body: JSON.stringify({reason: "action"})}
    if(!body.instance) return {statusCode: 400, body: JSON.stringify({reason: "instance"})}
    if(!body.region) return {statusCode: 400, body: JSON.stringify({reason: "region"})}
    if(!body.zone) return {statusCode: 400, body: JSON.stringify({reason: "zone"})}
    if(!process.env.ACCESS_KEY) return {statusCode: 400, body: JSON.stringify({reason: "ACCESS_KEY"})}
    if(!process.env.SECRET_KEY) return {statusCode: 400, body: JSON.stringify({reason: "SECRET_KEY"})}
    if(!process.env.PROJECT_ID) return {statusCode: 400, body: JSON.stringify({reason: "PROJECT_ID"})}

    const client = createClient({
        accessKey: process.env.ACCESS_KEY,
        secretKey: process.env.SECRET_KEY,
        defaultProjectId: process.env.PROJECT_ID,
        defaultRegion: body.region,
        defaultZone: body.zone,
    })

    const api = new Instance.v1.API(client)

    await api.serverAction({
        action: body.action,
        serverId: body.instance
    })

    return {
        body: JSON.stringify({
            action: body.action
        }),
        statusCode: 200,
    };
}