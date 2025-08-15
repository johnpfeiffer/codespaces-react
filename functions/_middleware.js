export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Map subdirectories to SPAs
  const apps = {
    '/blog': 'blog',
    '/engineer': 'engineer',
    '/manager': 'manager'
  };
  // Find which app this request is for
  const appPath = Object.keys(apps).find(path => 
    url.pathname.startsWith(path)
  );
  
  if (!appPath) {
    // Not an app route - serve normally
    return context.next();
  }
  
  const appName = apps[appPath];
  const relativePath = url.pathname.slice(appPath.length) || '/';
  
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
