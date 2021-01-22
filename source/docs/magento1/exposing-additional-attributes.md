---
id: exposing-additional-attributes
title: Exposing additional attributes
---

In case where you need to expose new attributes on the existing endpoint you can simply add this attribute on your `api2.xml` file. For that, you need to retrieve resource name (API_UNIQUE_NAME value if you follow the basic structure shown in "Add custom endpoint section") and add your attribute(s) into the `attributes` node.

- How to retrieve the resource name: you can retrieve this data on all `api2.xml` file.
- Expose attribute `custom_attribute` for customer data:
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
- Expose attribute `custom_attribute` for product data:
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
- Expose attribute `custom_attribute` for category data:
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
- Forcing attributes:
Sometime some attributes is forcing exclude. You can retrieve an example on `app/code/community/Clockworkgeek/Extrarestful/etc/api2.xml` file:
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
for avoid this exclude, you can simply retrieve node who you want to avoid in your own `api2.xml` file and set to `0`.

example for avoiding image restriction for guest and customer:
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
