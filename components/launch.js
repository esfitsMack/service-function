export default function getLaunchSettings(type) { //Only the port number will be different...this extra logic is for future expansion.
	let block = "";
  let blockType = type.toLowerCase().trim();
	if (blockType === "http") {
		block = getHTTPLaunch();
	}
	else if(blockType === "eventhub") {
		block = getEventHubLaunch();
	}
	else if(blockType === "blobpoll" || blockType === "blobevent") {
		block = getBlobLaunch();
	}
	else if(blockType === "timer") {
		block = getTimerLaunch();
	}
	return block;
  }

  export function getEventHubLaunch() {
	return `
{
  "profiles": {
    "function": {
      "commandName": "Project",
      "commandLineArgs": "--port 7029",
      "launchBrowser": false
    }
  }
}
	`;
  }

  export function getTimerLaunch() {
	return `
{
  "profiles": {
    "function": {
      "commandName": "Project",
      "commandLineArgs": "--port 7135",
      "launchBrowser": false
    }
  }
}
	`;
  }

  export function getBlobLaunch() {
	return `
{
  "profiles": {
    "function": {
      "commandName": "Project",
      "commandLineArgs": "--port 7054",
      "launchBrowser": false
    }
  }
}
	`;
  }

  export function getHTTPLaunch() {
	return `
{
  "profiles": {
    "function": {
      "commandName": "Project",
      "commandLineArgs": "--port 7262",
      "launchBrowser": false
    }
  }
}
	`;
  }