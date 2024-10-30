const semver = require("semver");

class Registry {
    constructor() {
        this.services = [];
        this.timeout = 15;
    }

    // eslint-disable-next-line class-methods-use-this
    getKey(name, version, ip, port) {
        return name + version + ip + port;
    }

    // remove expired services
    cleanUp() {
        const now = Math.floor(new Date() / 1000);
        Object.keys(this.services).forEach(key => {
            if(this.services[key].timestamp + this.timeout < now) {
                delete this.services[key];
                console.log(`Removed expired service ${key}`);
                
            }
        })
    }

    // get specific and random versions of services
    get(name, version) {
        this.cleanUp();
        const candidate = Object.values(this.services).filter(service => {
            return service.name === name && semver.satisfies(service.version, version);
        })
        return candidate[Math.floor(Math.random() * candidate.length)];
    }

    // register a service
    register(name, version, ip, port) {
        this.cleanUp();
        const key = this.getKey(name, version, ip, port);

        if (!this.services[key]) {
            this.services[key] = {};
            this.services[key].timestamp = Math.floor(new Date() / 1000);

            this.services[key].ip = ip;
            this.services[key].port = port;
            this.services[key].version = version;
            this.services[key].name = name;
            console.log(`Added service ${name}, version ${version} at ${ip}:${port}`);
            return key;
        }
        this.services[key].timestamp = Math.floor(new Date() / 1000);
        console.log(`Updated service ${name}, version ${version} at ${ip}:${port}`);
        return key;
    };

    // unregister a service
    unregister(name, version, ip, port) {
        const key = this.getKey(name, version, ip, port);
        delete this.services[key];
        console.log(`Deleted service ${name}, ${version} at ${ip}:${port}`);
        return key;
    }
}

module.exports = Registry;