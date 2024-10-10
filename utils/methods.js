export default function KVClient() {
    return `
        string CLIENT_ID = Environment.GetEnvironmentVariable("APPSECRETID")
        string CLIENT_ID = Environment.GetEnvironmentVariable("APPSECRET")
        string KEYVAULT_URI = Environment.GetEnvironmentVariable("KEYVAULT_URI")
        string secret = "";
        EventData eventData;        
        try
        {
            client = new KeyVaultClient(new KeyValutClient.AuthenticationCallback(
                async (string auth, string res, string scope) =>
                {
                    let authContext = new AuthenticationContext(auth);
                    let credential = new ClientCredential(CLIENT_ID, CLIENT_SECRET);
                    AuthenticationResult result = await authContext.AcquireTokenAsync(res, credential);
                    if (result == null)
                    {
                        throw new InvalidOperationException("Failed to retrieve KV token");
                    }
                    return result.AccessToken;
                }
            ));
            secret = await client.GetSecretAsync(KEYVAULT_URI, key)
        } 

        return secret;
  `;
  }