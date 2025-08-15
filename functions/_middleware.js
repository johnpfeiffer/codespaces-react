export async function onRequest(context) {
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
  
  
  let newPath;
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
  
  // Create new request with rewritten path
  const newUrl = new URL(url);
  newUrl.pathname = newPath;
  
  // Fetch from the new path
  const response = await fetch(newUrl, context.request);
  
  // If it's a 404 and not an asset, try serving index.html
  if (response.status === 404 && !restOfPath.includes('.')) {
    newUrl.pathname = `/apps/${appName}/index.html`;
    return fetch(newUrl, context.request);
  }
  
  return response;

}
