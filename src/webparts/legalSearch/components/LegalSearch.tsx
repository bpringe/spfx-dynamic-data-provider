import * as React from 'react';
import styles from './LegalSearch.module.scss';
import { ILegalSearchProps } from './ILegalSearchProps';
import { ILegalSearchState } from './ILegalSearchState';
import { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";

export default class LegalSearch extends React.Component<ILegalSearchProps, ILegalSearchState> {

  constructor(props: ILegalSearchProps) {
    super(props);

    this.state = {
      listName: 'Documents',
      listItems: [],
      metadataFields: []
    };
  }

  public async componentDidMount() {

    const [listItems, metadataFields] = await Promise.all([
      this._getListItems(this.state.listName),
      this._getListMetadataFields(this.state.listName)
    ]);

    this.setState({
      listItems,
      metadataFields
    });
  }

  private async _sendSPGetRequest(url) {
    return await fetch(url, {
      headers: {
        'Accept': 'application/json;odata=nometadata'
      }
    }).then(res => res.json())
      .then(data => data.value);
  }

  private async _getListItems(listName) {
    const url = `${this.props.context.pageContext.web.absoluteUrl}/_api/lists/getbytitle('${listName}')/items`;
    return await this._sendSPGetRequest(url);
  }

  private async _getListMetadataFields(listName) {
    // TODO: Optimize this query using an ODATA filter if possible.
    //       Filter on fields used in this article: https://www.codeproject.com/Articles/1235629/Sharepoint-Framework-SPFx-Large-List-Webpart-using
    const url = `${this.props.context.pageContext.web.absoluteUrl}/_api/lists/getbytitle('${listName}')/fields`;
    const fields = await this._sendSPGetRequest(url);
    return fields.filter(field => field.TermSetId);
  }

  private onTaxPickerChange(fieldTitle: string, terms: IPickerTerms): void {
    console.log(`Field: ${fieldTitle} -- Terms: ${terms}`);
  }

  public render(): React.ReactElement<ILegalSearchProps> {
    return (
      <div className={styles.legalSearch}>
        {this.state.metadataFields.map(field =>
          <TaxonomyPicker
            allowMultipleSelections={true}
            termsetNameOrID={field.TermSetId}
            panelTitle="Select Term"
            label={field.Title}
            context={this.props.context}
            onChange={(terms) => this.onTaxPickerChange(field.Title, terms)}
            isTermSetSelectable={false}
          />
        )}
        {/* {this.state.listItems.length > 0 &&
          <ListView
            items={items}
            viewFields={viewFields}
            iconFieldName="ServerRelativeUrl"
            compact={true}
            selectionMode={SelectionMode.multiple}
            selection={this._getSelection}
            showFilter={true}
            defaultFilter="John"
            filterPlaceHolder="Search..."
            groupByFields={groupByFields}
          />} */}
      </div>
    );
  }
}
