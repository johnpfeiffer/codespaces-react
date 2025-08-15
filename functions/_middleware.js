export async function onRequest(context) {
  try {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // Skip if it's already pointing to /apps/ or is a root request
  if (path === '/') {
    return context.next();
  }
  
  // Extract app name from path (e.g., /blog/something → blog)
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) {
    return context.next();
  }
  
  const appName = segments[0];
  const restOfPath = segments.slice(1).join('/');
  
  // List of valid apps (or you could check dynamically)
  const validApps = ['blog', 'engineer', 'manager']; // Add your apps here
  
  if (!validApps.includes(appName)) {
    console.log("not a valid app name");
    return context.next();
  }
  
  console.log(`App: ${appName}`);
  
  
  let targetPath;
  if (restOfPath === '' || !restOfPath) {
    // Root of app - serve index.html
    newPath = `/apps/${appName}/index.html`;
  } else if (restOfPath.includes('.')) {
    // Has file extension - probably an asset
    newPath = `/apps/${appName}/${restOfPath}`;
  } else {
    // No extension - probably a route, serve index.html for SPA
    newPath = `/apps/${appName}/index.html`;
  }
  
// Fetch the resource
    const newUrl = new URL(url);
    newUrl.pathname = targetPath;
    
    console.log('Fetching:', newUrl.pathname);
    
    let response = await context.env.ASSETS.fetch(newUrl.toString());
    
    // If 404 on non-asset, try index.html
    if (response.status === 404 && !restOfPath.includes('.')) {
      newUrl.pathname = `/apps/${appName}/index.html`;
      response = await context.env.ASSETS.fetch(newUrl.toString());
    }
    
    // CRITICAL: Rewrite HTML content
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('text/html')) {
      let html = await response.text();
      
      console.log('Rewriting HTML for:', appName);
      
      // Inject base tag for proper routing
      if (!html.includes('<base')) {
        html = html.replace(
          '<head>',
          `<head>\n  <base href="/${appName}/">`
        );
      }
      
      // Rewrite absolute asset paths in src and href
      // This makes assets load from the correct subdirectory
      html = html.replace(/src="\//g, `src="/${appName}/`);
      html = html.replace(/href="\//g, `href="/${appName}/`);
      
      // Rewrite paths in Vite/React scripts
      html = html.replace(/from ['"]\//g, `from '/${appName}/`);
      
      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
    
    // Rewrite JavaScript files for API calls
    if (contentType.includes('javascript')) {
      let js = await response.text();
      
      console.log('Rewriting JS for:', appName);
      
      // Rewrite fetch calls to include app prefix
      js = js.replace(/fetch\(['"]\/api/g, `fetch('/${appName}/api`);
      js = js.replace(/fetch\(['"]\/(?!http)/g, `fetch('/${appName}/`);
      
      // Rewrite router paths if needed
      js = js.replace(/path:\s*['"]\//g, `path: '/${appName}/`);
      
      return new Response(js, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
    
    // Return as-is for other content types
    return response;
    
  } catch (error) {
    console.error('Middleware error:', error.message);
    console.error('Stack:', error.stack);
    
    // Return error page instead of throwing
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body>
        <h1>Routing Error</h1>
        <p>URL: ${context.request.url}</p>
        <pre>${error.message}</pre>
        <p>Please check the console logs.</p>
      </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
