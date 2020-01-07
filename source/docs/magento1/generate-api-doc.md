---
id: generate-api-doc
title: Generate api doc
---
Magento 1 doesn't have an official API Doc, but you can generate your own API doc with a `PHP` open source script.

You can find this script here: https://github.com/PH2M/Magento1-Generate-Api-Doc

## Generate your API doc input files
- Download the following `PHP` script https://github.com/PH2M/Magento1-Generate-Api-Doc/blob/develop/generateApiDoc.php
- Past it on your Magento's `shell` directory
- Create api/input and api/doc directory on your Magento's
- Run this script `php shell/generateApiDoc.php` (Magento need to be up for working)

This script generates `PHP` and `JSON` files in your `api/input` directory, these files help you to generate the [apiDoc](https://github.com/apidoc/apidoc).

## Generate your API doc
For this step you need to install https://github.com/apidoc/apidoc or have [Docker](https://www.docker.com/)
- With Docker: 
    - In your Magento's root directory, run docker run --rm -v $(pwd)/api:/home/node/apidoc apidoc/apidoc -o doc -i input ($(pwd) is for Linux, for other system see https://stackoverflow.com/questions/41485217/mount-current-directory-as-a-volume-in-docker-on-windows-10#answer-41489151
- With Npm:
    - You need to install https://github.com/apidoc/apidoc
    - In your Magento's root directory, run apidoc -i api/input/ -o api/doc/

Your API doc is now available in `api/doc/index.html`

## Tips
- Link with anchor: for retrieve link from a specific endpoint, select the endpoint from the sidebar and copy URL