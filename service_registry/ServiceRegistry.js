import semver from 'semver';
import { LocalStorage } from 'node-localstorage';
const localstorage = new LocalStorage('./services_db');

class ServiceRegistry {
  constructor() {
    this.services = JSON.parse(localstorage.getItem('services'));
    this.timeout = 10000; //in seconds
  }

  get(name, version) {
    this.cleanup();
    const candidates = Object.values(this.services).filter(service => {
      return service.name === name && semver.satisfies(service.version, version);
    });
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  register(name, version, ip, port){
    this.cleanup();
    this.services = localstorage.getItem('services');
    const key = name + version + ip + port;
    if(!this.services[key]) {
      this.services[key] = {};
      this.services[key].timestamp = Math.floor(new Date() / 1000);
      this.services[key].ip = ip;
      this.services[key].port = port;
      this.services[key].name = name;
      this.services[key].version = version;
      localstorage.setItem(JSON.stringify(this.services));
      console.log(`Added Service ${name}, version: ${version}, at ${ip}:${port}`);
      return key;
    }
    this.services[key].timestamp = Math.floor(new Date() / 1000);
    localstorage.setItem(JSON.stringify(this.services));
    console.log(`Updated Service ${name}, version: ${version}, at ${ip}:${port}`);
    return key;
  }

  async unregister(name, version, ip, port)
  {
    this.services = localstorage.getItem('services');
    const key = name + version + ip + port;
    delete this.services[key];
    await localstorage.setItem(JSON.stringify(this.services));
    console.log(`Deleted Service ${name}, version: ${version}, at ${ip}:${port}`);
    return key;
  }

  cleanup() {
    this.services = localstorage.getItem('services');
    const now = Math.floor(new Date() / 1000);
    Object.keys(this.services).forEach(key => {
      if(this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        console.log(`Removed Service ${key}`);
      }
    });
  }
}

export default ServiceRegistry;