Troubleshooting

* Auth issue:
    * check the stdout/stderr of your server
        * Cookie Domain was removed?
        * secrets for your backend correctly set?
        * session store correctly set ?
            * Filesystem storage: ensure you have the permissions to edit the sessions
            * Multiple FC processes: ensure that you are using a store that's compatible with a distributed architecture (ex: redis, memcached, etc.).
* Redirection loop
    * check the stdout/stderr of your server
        * Shop not found and falling back to the default one?
            * Is the list of validUrls correct? Is FRONT_COMMERCE_URL in the `validUrls` logged?
            * Is the `url` logged is the one you used in your browser? If it has the port in it, it's likely because your server proxy/load balancer is not well configured. Please add `X-Forwarded-Proto`, `X-Forwarded-Port` & `X-Forwarded-For` ([classic headers for proxies and load balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/x-forwarded-headers.html))
        * Redirecting to HTTPS although I don't have HTTPS on my server
            * If it's for production, please fix this. This is a severe security issue for your website and your users. It can also negatively impact your SEO and the trust of your users.
            * If you know what you are doing, please make sure that your proxy sets `X-Forwarded-Proto` with `https`
* JavaScript is not loading on my site
    * Which browser? Check your `package.json::browserslist`
* SSR is broken
    * Check your server logs for the error
    * Ensure that no pure client side code is loaded on your server (ex: google maps)
* My bundle js is too big
    * `DEBUG=front-commerce:webpack npm run build`
        * Look for big libraries and try to avoid their usage client side if possible.
        * Ensure that there is no import of server side code in your client bundle
* The data returned by my GraphQL server is wrong
    * Check that the data is also wrong if you execute the same query in your `/playground` (only available if `FRONT_COMMERCE_ENV !== "production"`)
    * `DEBUG=axios npm start` will show you where your data is coming from
    * Ensure your cache is up to date
    * Check for the resulting data in your `resolvers` by adding console.logs
    
 ## Another issue?
 
 Please contact our support or open an issue descripting the encountered problem along with your environment using ` npx envinfo --system --binaries`
