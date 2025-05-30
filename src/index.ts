export default {
  async fetch(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    if (!url) {
      if (request.url.includes("favicon.ico")) {
        return new Response(null, {
          status: 200,
          headers: {
            "Content-Type": "image/x-icon",
          },
        });
      }

      return new Response("No URL provided", {
        status: 400,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    const res = await fetch(url ?? "", { ...request, redirect: "manual" });

    let text = await res.text();

    let returnText = updateLinksInHTML(text, url ?? "");

    return new Response(returnText, {
      status: res.status === 301 || res.status === 302 ? 200 : res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  },
};

const updateLinksInHTML = (html: string, url: string): string => {
  const baseUrl = `https://linksie-poc.robo-house.workers.dev/?url=${url}`;
  html = html.replace(/href="(.*?)"/g, (_m: any, v: string) => {
    return 'href="' + baseUrl + v + '"';
  });

  html = html.replace(/src="(.*?)"/g, (_m: any, v: string) => {
    return 'src="' + baseUrl + v + '"';
  });

  return html;
};
