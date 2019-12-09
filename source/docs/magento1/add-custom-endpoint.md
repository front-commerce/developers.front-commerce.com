---
id: add-custom-endpoint
title: Add your custom endpoint
---

You can add your custom endpoint easily and fasted.
Follow this main step :

1. Add and complete `api2.xml` file
2. Implement API method(s)

## Add and complete api2.xml

`api2.xml` is your main api config file, you can add this file on your own module in `etc` directory.

This is a basic structure of this config file :

```
<?xml version="1.0"?>
<config>
    <api2>
        <resource_groups>
            <{ACL_UNIQUE_NAME} translate="title" module="{MODULE_NAME}">
                <title>{ACL_NAME}</title>
                <sort_order></sort_order>
            </{ACL_UNIQUE_NAME}>
        </resource_groups>
        <resources>
            <{API_UNIQUE_NAME} translate="title" module="{MODULE_NAME}">
                <group>{ACL_UNIQUE_NAME}</group>
                <model>{MAGENTO_MODEL}</model>
                <title>{API TITLE}</title>
                <sort_order></sort_order>
                <privileges>
                    <!-- API PRIVILEGE (GET / POST / UPDATE / DELETE) -->
                    <admin>
                        <create>1</create>
                        <retrieve>1</retrieve>
                        <update>1</update>
                        <delete>1</delete>
                    </admin>
                    <customer>
                        <create>1</create>
                        <retrieve>1</retrieve>
                        <update>1</update>
                        <delete>1</delete>
                    </customer>
                    <guest>
                        <create>1</create>
                        <retrieve>1</retrieve>
                        <update>1</update>
                        <delete>1</delete>
                    </guest>
                </privileges>
                <attributes>
                    <!-- ATTRIBUTE TO EXPOSE -->
                    <entity_id>Entity ID </entity_id>
                </attributes>
                <routes>
                    <!-- API ROUTES -->
                    <route_entity>
                        <route>/entity/:id</route>
                        <action_type>entity</action_type>
                    </route_entity>
                    <route_collection>
                        <route>/entities</route>
                        <action_type>collection</action_type>
                    </route_collection>
                </routes>
                <versions></versions>
            </{API_UNIQUE_NAME}>
        </resources>
    </api2>
</config>
```

- Node description :

  - [Optional]`resource_groups` use for declare new resource group. You can retrieve this resource when you update API resource Role. Every resource need to be affected to a resource group
  - `resources` it's here who you need to add your custom endpoint. Every resource need to have group (see `resource_groups`), model and title.
  - `resources privileges` choose the HTTP Method allow for `customer`, `guest` and `admin`. `create` = POST / `retrieve` = GET / `update` = UPDATE / `delete` = DELETE ([Rest roles configuration Magento 1](https://devdocs.magento.com/guides/m1x/api/rest/permission_settings/roles_configuration.html))
  - `resources attributes` attribute list authorized to be retrieve or send ([Rest attributes configuration Magento 1](https://devdocs.magento.com/guides/m1x/api/rest/permission_settings/attributes_configuration.html))
  - `resources routes` configure your URL endpoint

- Example :
  This following example is for a basic social network API, who can retrieve list of social networks posts and specific post thanks to 2 endpoints `/social-network-post/:id` and `/social-network-posts`

```
<?xml version="1.0"?>
<config>
    <api2>
        <resource_groups>
            <social_network translate="title" module="module_network">
                <title>Social network</title>
                <sort_order>100</sort_order>
            </social_network>
        </resource_groups>
        <resources>
            <social_network_posts translate="title" module="module_network">
                <group>social_network</group>
                <model>module_network/api2_post</model>
                <title>Social network posts</title>
                <sort_order>10</sort_order>
                <privileges>
                    <!-- Allow to retrieve for every groups -->
                    <admin>
                        <retrieve>1</retrieve>
                    </admin>
                    <customer>
                        <retrieve>1</retrieve>
                    </customer>
                    <guest>
                        <retrieve>1</retrieve>
                    </guest>
                </privileges>
                <attributes>
                    <entity_id>Post ID</entity_id>
                    <title>Title</title>
                    <descrition>Description</descrition>
                    <link>Link</link>
                    <image>Image</image>
                </attributes>
                <routes>
                    <route_entity>
                        <route>/social-network-post/:id</route>
                        <action_type>entity</action_type>
                    </route_entity>
                    <route_collection>
                        <route>/social-network-posts</route>
                        <action_type>collection</action_type>
                    </route_collection>
                </routes>
                <versions></versions>
            </social_network_posts>
        </resources>
    </api2>
</config>
```

## Implement API methods

### Directory
First think to know , your directory is alway like that :
`[MODULE]/[MODEL]/Rest/[Guest / Customer / Admin]/V1.php`

For the example with the social network, the directory is :

- `[MODULE]/Model/Api2/Post/Rest/Guest/V1.php` (for guest mode)
- `[MODULE]/Model/Api2/Post/Rest/Customer/V1.php` (for customer mode)

this file is your API entrypoint.

Warning !
Never forget to add Customer entrypoint, if do nothing special under guest mode,
you can simply extend `Guest/V1.php` on your `Customer/V1.php`
If you don't do that, when user is loggin your endpoint cannot work.

### Methods to implement

- [GET] `protected function _retrieve()` call for `entity` action type
- [GET] `protected function _retrieveCollection()` call for `collection` action type
- [POST] `protected function _create()` call for `collection` action type, body is mandatory
- [PUT] `protected function _update()` call for `entity` action type, body is mandatory
- [PUT] `protected function _multiUpdate()` call for `collection` action type, body is mandatory
- [DELETE] `protected function _delete()` call for `entity` action type, body is mandatory
- [DELETE] `protected function _multiDelete()` call for `collection` action type, body is mandatory

### Example

```
<?php

/**
 * Class Module_Network_Model_Api2_Post_Rest_Guest_V1
 */
class Module_Network_Model_Api2_Post_Rest_Guest_V1 extends FrontCommerce_Integration_Model_Api2_Abstract
{
    /**
     * Get post list
     *
     * @return array
     */
    protected function _retrieveCollection()
    {
        $collection = $this->_getCollection();
        $this->_applyCollectionModifiers($collection);
        $this->_loadCollection($collection);
        $this->addCacheHeaders($collection->getCacheLifetime());
        $data = $collection->walk('toArray');
        return array_values((array) $data);
    }

    /**
     * Retrieve post collection
     *
     */
    protected function _getCollection()
    {
        $collection = Mage::getResourceModel('module_network/post_collection');
        return $collection;
    }

    /**
     * Retrieve information about specified socialize
     *
     * @throws Mage_Api2_Exception
     * @return array
     */
    protected function _retrieve()
    {
        $entityId = this->getRequest()->getParam('entity_id');
        /* @var $stockItem Mage_CatalogInventory_Model_Stock_Item */
        $post = Mage::getModel('module_network/post')->load($entityId);
        if (!$post || !$post->getId() || $post->getId() != $entityId) {
            $this->_critical(self::RESOURCE_NOT_FOUND);
        }
        return $post->getData();
    }
}

```

### Testing

Best way for testing your new endpoint is to use Postman (or anything else like that).

- Guest testing : If your endpoint can be access in guest mode, you can simply send GET / POST / DELETE / UPDATE request
  to your endpoint for see the response
- Customer testing : You need to add credential and token for your request. You can retrieve all this informations in your database

  - Consumer Key = `key` in table `oauth_consumer`
  - Consumer Secret = `secret` in table `oauth_consumer`
  - Access Token = `token` of user in table `oauth_token`
  - Token secret = `secret` of same user in table `oauth_token`
    ![Customer test](./assets/testing.png)

## Good to know

- If you can, extend `FrontCommerce_Integration_Model_Api2_Abstract` in your own API class. This class add useful functions.
- If you apply `_applyCollectionModifiers($collection)` to your own `$collection` you can use dynamic API collection filter (see [Magento documention](https://devdocs.magento.com/guides/m1x/api/rest/get_filters.html))
- For implement any API error, use `$this->_critical(ERR_CODE);`
- If you have complexe API, you can override `dispatch()` method for add more action and operation.
