import * as React from 'react';
import styles from './LegalSearch.module.scss';
import { ILegalSearchProps } from './ILegalSearchProps';
import { ILegalSearchState } from './ILegalSearchState';
import { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";

export default class LegalSearch extends React.Component<ILegalSearchProps, ILegalSearchState> {

  constructor(props: ILegalSearchProps) {
    super(props);

    this.state = {
      metadataFields: []
    };
  }

  public async componentDidMount() {
    const metadataFields = await this._getListMetadataFields('Documents');
    this.setState({ metadataFields });
  }

  private async _getListMetadataFields(listName) {
    // TODO: Optimize this query using an ODATA filter if possible.
    const url = `${this.props.context.pageContext.web.absoluteUrl}/_api/lists/getbytitle('${listName}')/fields`;
    const fields = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=verbose'
      }
    })
      .then(res => res.json())
      .then(data => data.d.results);
    const metadataFields = fields.filter(field => field.TermSetId);
    return metadataFields;
  }

  private onTaxPickerChange(terms: IPickerTerms): void {
    console.log("Terms", terms);
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
            onChange={this.onTaxPickerChange}
            isTermSetSelectable={false}
          />
        )}
      </div>
    );
  }
}
