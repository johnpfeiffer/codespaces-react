export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Auto-detect any path that starts with /word
  const pathMatch = url.pathname.match(/^\/([a-z]+)(\/.*)?$/);
  
  if (!pathMatch) {
    console.log("No app matches the path regex");
    return context.next();
  }
  
  const appName = pathMatch[1];
  const relativePath = pathMatch[2] || '/';
  
  
  console.log(`App: ${appName}`);
  
  // Check if this app exists
  const testUrl = new URL(context.request.url);
  testUrl.pathname = `/apps/${appName}/index.html`;
  
  const exists = await context.env.ASSETS.fetch(testUrl, { method: 'HEAD' });
  if (!exists.ok) return context.next();
  
  // Rewrite the request to the app's actual location
  const newUrl = new URL(context.request.url);
  newUrl.pathname = `/apps/${appName}${relativePath}`;
  
  // Fetch the rewritten request
  const response = await context.env.ASSETS.fetch(newUrl, context.request);
  
  // If it's HTML, inject base tag and rewrite asset paths
  if (response.headers.get('content-type')?.includes('text/html')) {
    let html = await response.text();
    
    // Inject base tag for proper routing
    html = html.replace(
      '<head>',
      `<head><base href="${appPath}/">`
    );
    
        // Rewrite absolute asset paths
    html = html.replace(/src="\//g, `src="${appPath}/`);
    html = html.replace(/href="\//g, `href="${appPath}/`);
    
    return new Response(html, response);
  }
  
  // For JS files, rewrite fetch/API calls if needed
  if (response.headers.get('content-type')?.includes('javascript')) {
    let js = await response.text();
    
    // Rewrite API calls to be relative
    js = js.replace(/fetch\(['"]\/api/g, `fetch('${appPath}/api`);
    
    return new Response(js, response);
  }
  
  return response;
}
