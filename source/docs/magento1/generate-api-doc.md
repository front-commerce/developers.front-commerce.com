---
id: generate-api-doc
title: Generate API doc
---

Magento 1 doesn't have an official API Documentation, but you can generate your own API doc with a PHP open source script.

You can find this script here: https://github.com/PH2M/Magento1-Generate-Api-Doc

## Generate your API doc input files

- Download the following PHP script https://github.com/PH2M/Magento1-Generate-Api-Doc/blob/develop/generateApiDoc.php
- Paste it in your Magento's `shell` directory
- Create `api/input` and `api/doc` directories in your Magento's root
- Ensure your Magento is available and working fine (database configured, etc.)
- Run the following script `php shell/generateApiDoc.php`

This script generates PHP and JSON files in your `api/input` directory, these files help you to generate the [apiDoc](https://github.com/apidoc/apidoc).

## Generate your API doc

For this step you need to install https://github.com/apidoc/apidoc or have [Docker](https://www.docker.com/)

- With Docker:
  - In your Magento's root directory, run `docker run --rm -v $(pwd)/api:/home/node/apidoc apidoc/apidoc -o doc -i input` ($(pwd) is for Linux, for other system see https://stackoverflow.com/questions/41485217/mount-current-directory-as-a-volume-in-docker-on-windows-10#answer-41489151
- With Npm:
  - You need to install https://github.com/apidoc/apidoc
  - In your Magento's root directory, run `apidoc -i api/input/ -o api/doc/`

Your API doc is now available in `api/doc/index.html`

## Tips

- Link with anchor: to share a link to a specific endpoint's documentation, select the endpoint from the sidebar and copy the URL
