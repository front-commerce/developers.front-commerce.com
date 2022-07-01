---
id: exposing-additional-attributes
title: Exposing additional attributes
description: In many shops, there are more attributes than the standard ones available in Magento. They then need to be fetched by Front-Commerce for usage in your application. In this documentation guide, you will learn how to add these attributes to any Magento REST endpoint.
---

An example of what this page will show you is how to expose newly created attributes in the endpoints already used in Front-Commerce. For instance, when retrieving products, Front-Commerce uses the `/api/rest/products` URL.

## Overview

In case where you need to expose new attributes on the existing endpoint you can add this attribute on your `api2.xml` file.

For that, you need to retrieve resource name (API_UNIQUE_NAME value if you follow the basic structure shown in "Add custom endpoint section") and add your attribute(s) into the `attributes` node.

## Retrieve the resource name

You can find this data on all `api2.xml` files.

## Update your `api2.xml` file

In this section you will learn how to expose a `custom_attribute` for the most common Magento resources.

### Customer data

It can be achieved with the following XML instructions:

```
# Your api2.xml file
...
 <resources>
    <customer>
        <attributes>
            <custom_attribute />
        </attributes>
    </customers>
</resources>
...
```

### Product data

It can be achieved with the following XML instructions:

```
# Your api2.xml file
...
 <resources>
    <product>
        <attributes>
            <custom_attribute />
        </attributes>
    </customers>
</resources>
...
```

### Category data

It can be achieved with the following XML instructions:

```
# Your api2.xml file
...
 <resources>
    <category>
        <attributes>
            <custom_attribute />
        </attributes>
    </customers>
</resources>
...
```

## For attributes excluded by another module

Sometimes, you will stumble upon modules that force attribute's exclusion. You can find an example in the `app/code/community/Clockworkgeek/Extrarestful/etc/api2.xml` file:

```
...
<category translate="title" module="extrarestful">
    ...
    <exclude_attributes>
        <admin>
            <write>
                <entity_id>1</entity_id>
                <updated_at>1</updated_at>
                <path>1</path>
                <level>1</level>
                <children_count>1</children_count>
                <image_url>1</image_url>
                <url>1</url>
            </write>
        </admin>
        <customer>
            <read>
                <image>1</image>
                <is_active>1</is_active>
            </read>
        </customer>
        <guest>
            <read>
                <image>1</image>
                <is_active>1</is_active>
            </read>
        </guest>
    </exclude_attributes>
    ...
</category>
...
```

To revert this exclude, you should retrieve the node you want to "disable" in your own `api2.xml` file and set its value to `0`.

For instance, to allow Guests and Customers to access categories images you would do as below:

```
# Your api2.xml file
...
 <resources>
    <category>
        <exclude_attributes>
            <customer>
                <read>
                    <image>0</image>
                </read>
            </customer>
            <guest>
                <read>
                    <image>0</image>
                </read>
            </guest>
        </exclude_attributes>
    </customers>
</resources>
...
```

If you have any questions, please do not hesitate to ask us.
