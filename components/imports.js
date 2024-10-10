export default function getImportsBlock(type) {
	let block = "";
	let blockType = type.toLowerCase().trim();
	if (blockType === "http") {
		block = getHTTPImports();
	}
	else if(blockType === "eventhub") {
		block = getEventHubImports();
	}
	else if(blockType === "blobpoll" || blockType === "blobevent") {
		block = getBlobImports();
	}
	else if(blockType === "timer") {
		block = getTimerImports();
	}
	return block;
  }

  export function getEventHubImports() {
	return `
		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Threading.Tasks;
		using Azure.Messaging.EventHubs;
		using Microsoft.Azure.Functions.Worker;
		using Azure.Messaging.EventHubs.Producer;
		using Microsoft.Extensions.Logging;
		using System.Diagnostics;
	`;
  }

  export function getTimerImports() {
	return `
		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Threading.Tasks;
		using Microsoft.Azure.Functions.Worker;
		using Microsoft.Azure.WebJobs;
		using Microsoft.Extensions.Logging;
		using Azure.Messaging.EventHubs;
		using Azure.Messaging.EventHubs.Producer;
		using System.Diagnostics;
	`;
  }

  export function getBlobImports() {
	return `
		using System;
		using System.IO;
        using System.Threading.Tasks;
        using Microsoft.Azure.Functions.Worker;
        using Microsoft.Extensions.Logging;
		using System.Collections.Generic;
		using System.Linq;
		using Microsoft.Azure.WebJobs;
		using Azure.Messaging.EventHubs;
		using Azure.Messaging.EventHubs.Producer;
		using System.Diagnostics;
	`;
  }

  export function getHTTPImports() {
	return `
		using System;
		using System.IO;
        using Microsoft.Azure.Functions.Worker;
		using System.Threading.Tasks;
		using Microsoft.AspNetCore.Mvc;
		using Microsoft.Azure.WebJobs;
		using Microsoft.AspNetCore.Http;
		using Microsoft.Extensions.Logging;
		using Newtonsoft.Json.Linq;
		using Newtonsoft.Json.Schema;
		using Azure.Storage.Files.Shares;
		using Microsoft.AspNetCore.Mvc.ModelBinding;
		using Newtonsoft.Json;
		using Azure.Messaging.EventHubs;
		using Azure.Messaging.EventHubs.Producer;
		using System.Diagnostics;
	`;
  }