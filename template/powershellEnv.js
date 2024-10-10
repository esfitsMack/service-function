import { File, render } from '@asyncapi/generator-react-sdk';
import {funcName } from '../utils/general';
import {shortName } from '../utils/general';
import {getTagByName } from '../utils/general';

export default function publishFile({ asyncapi, originalAsyncAPI }) 
{
  let genscript = true;
  let specObj = JSON.parse(originalAsyncAPI);
  var filename = specObj.info.title + ".ps1"
  let tags = specObj.tags;
  let tag = getTagByName(tags, "iac"); //check for the iac tag
  if (tag === undefined){ //nothing to deploy, no need for a script
    genscript = false;
  }
  else if (tag.externalDocs) //if true, the EnvMgr will use an external file, otherwise gen the script.
  {
    genscript = false;  
  }
  let subChannel;
  for (let channel of Object.values(asyncapi.channels())){
      if (channel.hasPublish){
          subChannel = channel
      }
  }
  //get the function type and if needed the verb blocks for the http type.
  let gencontainerscript = subChannel.ext("x-containerapp");
  let namespace = asyncapi.info().title().toLowerCase();
      //derive names for azure objects
  let shortNameValue=shortName(namespace); //collapses the long namespace name to a short name suitable for Azure's naming conventions
  let funcNameValue=funcName(namespace); //extracts a suitable name from the namespace name suitable or Azure's naming convention
  //set minimum default ps1 input parameters to create a function environment
  let region = "EASTUS";
  let resourceGroupName = "rg_itf_dev";
  let storageSku = "Standard_GRS";
  let planSku = "B1";
  let workerType = "Windows";
  let runTime = "DotNet";
  let environment = "itf_default_containerapp";
  let apiName = "ITF";
  let sourcePath = ".";
  //get the azure tags...should always exist even if the tag is empty
  let azureTags = specObj["x-azure"];

  for (let i = 0; i < azureTags.length; i++) {
    tag = azureTags[i];
    if (tag.name === "region")
    {
      if(tag.value && tag.value !== ""){
        region = tag.value;}
    }
    else if(tag.name === "resourceGroupName")
    {
      if(tag.value && tag.value !== ""){
        resourceGroupName  = tag.value;}      
    }
    else if(tag.name === "storageSku")
    {
      if(tag.value && tag.value !== ""){
        storageSku = tag.value;}
    }
    else if(tag.name === "planSku")
    {
      if(tag.value && tag.value !== ""){
        planSku = tag.value;}
    }
    else if(tag.name === "workerType")
    {
      if(tag.value && tag.value !== ""){
        workerType = tag.value;}
    }
    else if(tag.name === "runTime")
    {
      if(tag.value && tag.value !== ""){
        runTime = tag.value;}
    }
    else if(tag.name === "environment")
    {
      if(tag.value && tag.value !== ""){
        environment = tag.value;}
    }
    else if(tag.name === "apiName")
    {
      if(tag.value && tag.value !== ""){
        apiName = tag.value;}
    }
    else if(tag.name === "sourcePath")
    {
      if(tag.value && tag.value !== ""){
        sourcePath = tag.value;}
    }
  }
  if(genscript)
  { 
    if(gencontainerscript)
    {      
      return <File name={`${filename}`}>
      {`
param ([Parameter(Mandatory)] $resourceGroupName = '${resourceGroupName}', $region='${region}', $environment='${environment}', $apiName='${apiName}', $sourcePath='${sourcePath}')

Connect-AzAccount

#create a resource group after confirming it does not already exist
Get-AzResourceGroup –Name $resourceGroupName -ErrorVariable notPresent -ErrorAction SilentlyContinue
if ($notPresent)
{         
	write-host "Creating resource group"   
	New-AzResourceGroup –Name $resourceGroupName –Location $region
	$notPresent=$null
}
else{
	write-host "Resource group exists."
}

#create the containerapp environment after confirming it does not already exist (set a namespace exists flat)
Get-AzContainerAppManagedEnv –Name $environment -RESOURCE_GROUP $resourceGroupName -ErrorVariable notPresent -ErrorAction SilentlyContinue
if ($notPresent)
{
	New-AzContainerAppManagedEnv –Name $environment -RESOURCE_GROUP $resourceGroupName -Location $region
}
else
{
	write-host "container environment exists"
}

#check for existence containerapp
Get-AzContainerApp –Name $apiName –RESOURCE_GROUP $resourceGroupName -ErrorVariable notPresent -ErrorAction SilentlyContinue
if ($notPresent)
{
		az containerapp up --name $apiName --resource-group $resourceGroupName --location $region --environment $environment --source $sourcePath
}
else{
	write-host "app exists...do nothing"
}`
      }</File>;
    }
    else
    {     
      return <File name={`${filename}`}>{
`
#authN/Z will be handled by the EnvironmentManager function when it executes this script.
#some input parameters will be handled by the EnvironmentManager function to pull type, env & version specific parms from a shared location.       

param ([Parameter(Mandatory)] $ResourceGroupName = '${resourceGroupName}', $region='${region}', $planSku= '${planSku}', $storageSku='${storageSku}', $workerType='${workerType}', $runTime='${runTime}')

$shortName=${shortNameValue}
$funcName=${funcNameValue}

#create a resource group after confirming it does not already exist
Get-AzResourceGroup –Name $ResourceGroupName -ErrorVariable notPresent -ErrorAction SilentlyContinue
if ($notPresent)
{         
  write-host "Creating resource group"   
  New-AzResourceGroup –Name $ResourceGroupName –Location $region
}
else{
  write-host "Resource group exists."
}

#create the hub namespace instance after confirming it does not already exist (set a namespace exists flat)
$plan = Get-AzFunctionAppPlan -ResourceGroupName $ResourceGroupName –Name $shortName -ErrorAction SilentlyContinue 
if ($plan -eq $null)
{
  write-host "create new app service plan"
  New-AzFunctionAppPlan -Name $shortName -ResourceGroupName $ResourceGroupName -Location $region -Sku $planSku -WorkerType $workerType
}
else
{
  write-host "app service plan exists"
}

#check for existence of topic 
$func = Get-AzFunctionApp –ResourceGroupName $ResourceGroupName –Name $funcName  -ErrorAction SilentlyContinue 
if ($func -eq $null)
{
  #check if storage account exists and create if neeeded
  $storage = Get-AzStorageAccount -ResourceGroupName $ResourceGroupName –Name $shortName -ErrorAction SilentlyContinue 
  if ($storage -eq $null)
  {
    write-host "create new storage account"
    New-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $shortName -Location $region -SkuName $storageSku
  }
  write-host "create new function app"
  New-AzFunctionApp -ResourceGroupName $ResourceGroupName -Name $funcName -StorageAccountName $shortName -Runtime $runTime -PlanName $shortName
}
else{
  write-host "function exists...do nothing"
}
  `   }</File>;
    }
  }
}
