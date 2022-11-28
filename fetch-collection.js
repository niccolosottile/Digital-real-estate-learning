const fetchOwnCollection = async () => {
    const WALLET_ADDRESS = '0x704CD00cbB8BF91038dFCF8bC008D065DDF1D8F8';
  
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        //'X-API-KEY': process.env.OPENSEA_API as string,
      },
    };
  
    const collectionResponse = await fetch(
      `https://api.opensea.io/api/v1/collections?asset_owner=${WALLET_ADDRESS}`,
      options,
    ).then(response => response.json());
  
    const collection = collectionResponse.map(item => ({
      details: item.description,
      slug: item.slug,
      name: item.name,
      contractAddress: item.primary_asset_contracts[0].address,
      owned: [],
    }));
  
    for (const iterator of collection) {
      const assetsResponse = await fetch(
        `https://api.opensea.io/api/v1/assets?owner=${WALLET_ADDRESS}&asset_contract_address=${iterator.contractAddress}&include_orders=false`,
        options,
      ).then(response => response.json());
  
      iterator.owned = assetsResponse.assets
        .map(item => ({
          name: item.name,
          img: item.image_url,
          id: item.token_id,
        }))
        .filter(item => item.name && item.img);
    }
  
    return collection;
};

console.log("ns1");