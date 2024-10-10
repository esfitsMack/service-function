
export default function getVerbBlock(verbname, funcname, route) {
    var res = verbname.toUpperCase();
    return `[Function("${funcname}")]
        public async Task<IActionResult> ${funcname}(
            [HttpTrigger(AuthorizationLevel.Function, "${res}", Route = ${route})] HttpRequest req)
        {
            string responseMessage="response";
            try {
                log.LogInformation("C# HTTP trigger function processed a ${res} request.");

            }
            catch (Exception ex)
            {
                Task taskPub = PublishErrorAsync(ex.ToString());
                await taskPub;
                return new BadRequestObjectResult(ex.Message);
            }
            return new OkObjectResult(responseMessage);
        }`
  }