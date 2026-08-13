const UAParser = require("ua-parser-js")


const getUserDeviceInfo = async (req) => {
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    const deviceType = result.device.type || "desktop";
    const userAgent = result.browser.name || "unknown";



    const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

    const response = await fetch(`http://ip-api.com/json/${ipAddress}`)

    const data = await response.json()


    return {
        deviceType,
        userAgent,
        ipAddress,
        city: data.city,
        state: data.regionName,
        country: data.country,


    }
}


module.exports = getUserDeviceInfo;