# react-async-select

### Description
This component is a combination of a combobox with asynchronous fetching of results and a modal search dialog for more filtering possibilities.

### Installation
```
npm install @opuscapita/react-async-select
```

### Demo
View the [DEMO](https://opuscapita.github.io/react-async-select)

### Builds
#### UMD
The default build with compiled styles in the .js file. Also minified version available in the lib/umd directory.
#### CommonJS/ES Module
You need to configure your module loader to use `cjs` or `es` fields of the package.json to use these module types.
Also you need to configure sass loader, since all the styles are in sass format.
* With webpack use [resolve.mainFields](https://webpack.js.org/configuration/resolve/#resolve-mainfields) to configure the module type.
* Add [SASS loader](https://github.com/webpack-contrib/sass-loader) to support importing of SASS styles.

### API
| Prop name                       | Type     | Default                                            | Description                                    |
| ------------------------------- | -------- | -------------------------------------------------- | ---------------------------------------------- |
| value                           | any      |                                                    | The initially selected value                   |
| onSelect                        | function | () => {}                                           | Selection callback function                    |
| handleChange                    | function | Sets internal state and calls setState callback    | Handles internal state on selecting an item    |
| loadOptions                     | function | () => Promise.resolve({ options: [] })             | Function for fetching options for the combobox |
| localizationTexts               | object   |                                                    | A dictionary with translated texts as values   |
| localizationTexts.["searchBy"]  |          |                                                    | UI text prefix for the first search field      |
| localizationTexts.["by"]        |          |                                                    | UI text prefix for other search fields         |
| localizationTexts.["close"]     |          |                                                    | UI text for the Close-button                   |
| localizationTexts.["select"]    |          |                                                    | UI text for the Select-button                  |
| localizationTexts.["loading"]   |          |                                                    | UI text for the loading state                  |
| localizationTexts.["noItems"]   |          |                                                    | UI text for an empty result set                |
| localizationTexts.["field.XYZ"] |          |                                                    | UI text for the column with name "XYZ"         |
| modal                           | object   |                                                    | Modal dialog specific props                    |
| modal.title                     | string   | ''                                                 | Localized title of the modal                   |
| modal.fields                    | [string] | []                                                 | List of fields to show as columns              |
| modal.loadOptions               | function | () => Promise.resolve({ data: [], totalCount: 0 }) | Function for fetching entries to the table     |

### Code example
```jsx
import React from 'react';
import { Dropdown } from '@opuscapita/react-component-example';

export default class ReactView extends React.Component {
  render() {
    return (
      <Dropdown
        localizationTexts={{
          searchBy: 'Search by',
          by: 'By',
          close: 'Close',
          select: 'Select',
          loading: 'Loading...',
          noItems: 'No items',
          "field.fieldName1": 'my field',
          "field.fieldName2": 'another field'
        }}
        value={'a'}
        loadOptions={
          () => Promise.resolve({
            options: [
              { label: 'a_DisplayValue', value: 'a' }
              { label: 'b_DisplayValue', value: 'b' }
            ]
          })
        }
        onSelect={() => { /* Capture new selected value */ }}
        handleChange={({ value, setState, onSelect }) => {
          setState({ value });
          onSelect(value);
          return value;
        }}
        modal={{
          title: 'Search entries',
          fields: [
            'fieldName1',
            'fieldName2',
          ],
          loadOptions: () => Promise.resolve({
            data: [
              {
                fieldName1: 'a_DisplayValue',
                fieldName2: 'a_AnotherDisplayValue'
                value: 'a'
              },
              {
                fieldName1: 'b_DisplayValue',
                fieldName2: 'b_AnotherDisplayValue'
                value: 'b'
              },
            ],
            totalCount: 0
          }),
        }}
      />
    );
  }
}
```
