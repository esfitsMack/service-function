
  export default function getTriggerBlock(type, trigger, connection, namespace, classname, funcname, verbs) {
	let block = "";
	let blockType = type.toLowerCase().trim();
	if (blockType === "http") {
		block = getHTTPBlock(namespace, classname, verbs);
	}
	else if(blockType === "eventhub") {
		block = getEventHubBlock(trigger, connection, namespace, classname, funcname);
	}
	else if(blockType === "blobpoll") {
		block = getBlobPollBlock(trigger, connection, namespace, classname, funcname);
	}
	else if(blockType === "blobevent") {
		block = getBlobEventBlock(trigger, connection, namespace, classname, funcname);
	}
	else if(blockType === "timer") {
		block = getTimerBlock(trigger, namespace, classname, funcname);
	}
	return block;
  }
  export function getHTTPBlock(namespace, classname, verbs) {
	return `
	namespace ${namespace}
	{
		public class ${classname}
		{
			private readonly ILogger<${classname}> log;

			public ${classname}(ILogger<${classname}> logger)
			{
				log = logger;
			}
			${verbs}			
			public static async Task PublishErrorAsync(string eventStr)
			{

				EventData eventData;
				//TODO: What will it take to use Identity instead of a connection string of secrets? Can it be done in the generator?!
				EventHubProducerClient producerClient = new EventHubProducerClient(Environment.GetEnvironmentVariable("ITFERRORSEND"));
				// Create a batch of events 
				using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
				eventData = new EventData(eventStr);

				if (!eventBatch.TryAdd(eventData))
				{
					throw new Exception($"The event could not be added.");
				}

				try
				{
					// Use the producer client to send the batch of events to the event hub
					await producerClient.SendAsync(eventBatch);
					Debug.WriteLine($"A batch of 1 events has been published.");
				}
				finally
				{
					await producerClient.DisposeAsync();
				}
			}
		}
	}`;
  }
  export function getEventHubBlock(trigger, connection, namespace, classname, funcname) {
	return `
		namespace ${namespace}
		{
			public class ${classname}
			{
				private readonly ILogger<${classname}> _logger;

				public ${classname}(ILogger<${classname}> logger)
				{
					_logger = logger;
				}

				[Function("${classname}")]
				public void Run([EventHubTrigger("${trigger}", Connection = "${connection}")] EventData[] events)
				{
					foreach (EventData @event in events)
					{
						_logger.LogInformation("Event Body: {body}", @event.Body);
						_logger.LogInformation("Event Content-Type: {contentType}", @event.ContentType);
					}
				}
			
				public static async Task PublishErrorAsync(string eventStr)
				{

					EventData eventData;
					//TODO: What will it take to use Identity instead of a connection string of secrets? Can it be done in the generator?!
					EventHubProducerClient producerClient = new EventHubProducerClient(Environment.GetEnvironmentVariable("ITFERRORSEND"));
					// Create a batch of events 
					using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
					eventData = new EventData(eventStr);

					if (!eventBatch.TryAdd(eventData))
					{
						throw new Exception($"The event could not be added.");
					}

					try
					{
						// Use the producer client to send the batch of events to the event hub
						await producerClient.SendAsync(eventBatch);
						Debug.WriteLine($"A batch of 1 events has been published.");
					}
					finally
					{
						await producerClient.DisposeAsync();
					}
				}			
			}
		}  
	`;
  }
  export function getBlobPollBlock(trigger, connection, namespace, classname, funcname) {
	return `
		namespace ${namespace}
		{
			public class ${classname}
			{
				private readonly ILogger<${classname}> _logger;

				public ${classname}(ILogger<${classname}> logger)
				{
					_logger = logger;
				}

				[Function("${classname}")]
				public async Task Run([BlobTrigger("${trigger}/{name}", Connection = "${connection}")] Stream stream, string name)
				{
					using var blobStreamReader = new StreamReader(stream);
					var content = await blobStreamReader.ReadToEndAsync();
					_logger.LogInformation($"C# Blob trigger function Processed blob  Name: {name}  Data: {content}");
				}
			
				public static async Task PublishErrorAsync(string eventStr)
				{

					EventData eventData;
					//TODO: What will it take to use Identity instead of a connection string of secrets? Can it be done in the generator?!
					EventHubProducerClient producerClient = new EventHubProducerClient(Environment.GetEnvironmentVariable("ITFERRORSEND"));
					// Create a batch of events 
					using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
					eventData = new EventData(eventStr);

					if (!eventBatch.TryAdd(eventData))
					{
						throw new Exception($"The event could not be added.");
					}

					try
					{
						// Use the producer client to send the batch of events to the event hub
						await producerClient.SendAsync(eventBatch);
						Debug.WriteLine($"A batch of 1 events has been published.");
					}
					finally
					{
						await producerClient.DisposeAsync();
					}
				}		
			}
		}
  
	`;
  }
  export function getBlobEventBlock(trigger, connection, namespace, classname, funcname) {
	return `
		namespace ${namespace}
		{
			public class ${classname}
			{
				private readonly ILogger<${classname}> _logger;

				public ${classname}(ILogger<${classname}> logger)
				{
					_logger = logger;
				}

				[Function("${classname}")]
				public async Task Run([BlobTrigger("${trigger}/{name}", Source = BlobTriggerSource.EventGrid, Connection = "${connection}")] Stream stream, string name)
				{
					using var blobStreamReader = new StreamReader(stream);
					var content = await blobStreamReader.ReadToEndAsync();
					_logger.LogInformation($"C# Blob trigger function Processed blob  Name: {name}  Data: {content}");
				}
			
				public static async Task PublishErrorAsync(string eventStr)
				{

					EventData eventData;
					//TODO: What will it take to use Identity instead of a connection string of secrets? Can it be done in the generator?!
					EventHubProducerClient producerClient = new EventHubProducerClient(Environment.GetEnvironmentVariable("ITFERRORSEND"));
					// Create a batch of events 
					using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
					eventData = new EventData(eventStr);

					if (!eventBatch.TryAdd(eventData))
					{
						throw new Exception($"The event could not be added.");
					}

					try
					{
						// Use the producer client to send the batch of events to the event hub
						await producerClient.SendAsync(eventBatch);
						Debug.WriteLine($"A batch of 1 events has been published.");
					}
					finally
					{
						await producerClient.DisposeAsync();
					}
				}		
			}
		}
  
	`;
  }
  export function getTimerBlock(trigger, namespace, classname, funcname) {
	return `
		namespace ${namespace}
		{
			public class ${classname}
			{
				private readonly ILogger _logger;

				public ${classname}(ILoggerFactory loggerFactory)
				{
					_logger = loggerFactory.CreateLogger<${classname}>();
				}

				[Function("${funcname}")]
				public void Run([TimerTrigger("${trigger}")] TimerInfo myTimer)
				{
					_logger.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
					
					if (myTimer.ScheduleStatus is not null)
					{
						_logger.LogInformation($"Next timer schedule at: {myTimer.ScheduleStatus.Next}");
					}
				}
			
				public static async Task PublishErrorAsync(string eventStr)
				{

					EventData eventData;
					//TODO: What will it take to use Identity instead of a connection string of secrets? Can it be done in the generator?!
					EventHubProducerClient producerClient = new EventHubProducerClient(Environment.GetEnvironmentVariable("ITFERRORSEND"));
					// Create a batch of events 
					using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
					eventData = new EventData(eventStr);

					if (!eventBatch.TryAdd(eventData))
					{
						throw new Exception($"The event could not be added.");
					}

					try
					{
						// Use the producer client to send the batch of events to the event hub
						await producerClient.SendAsync(eventBatch);
						Debug.WriteLine($"A batch of 1 events has been published.");
					}
					finally
					{
						await producerClient.DisposeAsync();
					}
				}		
			}
		}
  
	`;
  }