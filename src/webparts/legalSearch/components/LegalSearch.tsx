import * as React from 'react';
import styles from './LegalSearch.module.scss';
import { ILegalSearchProps } from './ILegalSearchProps';
import { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import { IDynamicDataPropertyDefinition, IDynamicDataCallables } from '@microsoft/sp-dynamic-data';

export default class LegalSearch extends React.Component<ILegalSearchProps, {}> implements IDynamicDataCallables {

  private onTaxPickerChange(terms: IPickerTerms):void {
    console.log("Terms", terms);
  }

  public render(): React.ReactElement<ILegalSearchProps> {
    return (
      <div className={styles.legalSearch}>
        <TaxonomyPicker
          allowMultipleSelections={true}
          termsetNameOrID="Contractors"
          panelTitle="Select Term"
          label="Contractor"
          context={this.props.context}
          onChange={this.onTaxPickerChange}
          isTermSetSelectable={false}
        />
      </div>
    );
  }
}
