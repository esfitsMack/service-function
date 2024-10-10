
export default function getItemGroupBlock(type) {
	let block = "";
  let blockType = type.toLowerCase().trim();
	if (blockType === "http") {
		block = getHTTPItemGroups();
	}
	else if(blockType === "eventhub") {
		block = getEventHubItemGroups();
	}
	else if(blockType === "blobpoll" || blockType === "blobevent") {
		block = getBlobItemGroups();
	}
	else if(blockType === "timer") {
		block = getTimerItemGroups();
	}
	return block;
  }

  export function getEventHubItemGroups() {
	return `<FrameworkReference Include="Microsoft.AspNetCore.App" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.21.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.EventHubs" Version="6.1.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.1.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore" Version="1.2.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.17.0" />
    <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.22.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="1.2.0" />
    <PackageReference Include="Microsoft.Azure.WebJobs" Version="3.0.41" />`;
  }

  export function getTimerItemGroups() {
	return `<FrameworkReference Include="Microsoft.AspNetCore.App" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.21.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.1.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.EventHubs" Version="6.1.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore" Version="1.2.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Timer" Version="4.1.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.17.0" />
    <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.22.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="1.2.0" />
    <PackageReference Include="Microsoft.Azure.WebJobs" Version="3.0.41" />`;
  }

  export function getBlobItemGroups() {
	return `<FrameworkReference Include="Microsoft.AspNetCore.App" />
    <PackageReference Include="Azure.Storage.Blobs" Version="12.21.2" />
    <PackageReference Include="Azure.Storage.Files.Shares" Version="12.19.1" />
    <PackageReference Include="Azure.Storage.Queues" Version="12.19.1" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.23.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.2.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore" Version="1.3.2" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs" Version="6.6.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.17.4" />
    <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.22.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="1.4.0" />
    <PackageReference Include="Microsoft.Extensions.Azure" Version="1.7.5" />
    <PackageReference Include="Microsoft.Azure.WebJobs" Version="3.0.41" />    
	  <PackageReference Include="Azure.Messaging.EventHubs" Version="5.11.5" />`;
  }

  export function getHTTPItemGroups() {
	return `<FrameworkReference Include="Microsoft.AspNetCore.App" />
	  <PackageReference Include="Azure.Messaging.EventHubs" Version="5.11.5" />
	  <PackageReference Include="Azure.Storage.Files.Shares" Version="12.19.1" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.21.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.1.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore" Version="1.2.1" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.17.0" />
    <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.22.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="1.2.0" />
    <PackageReference Include="Microsoft.Azure.WebJobs" Version="3.0.41" />`;
  }