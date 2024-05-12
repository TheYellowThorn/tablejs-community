import { IColumnConfig } from './../../types/i-column-config';
import { IGridData } from './../../../../../app/query.module/types/i-grid-data';

export const testColumnConfigs: IColumnConfig[] = [
    {
      'name': '',
      'id': 'checkbox',
      'dataClass': 'checkbox',
      'width': '5%'
    },
    {
      'name': 'segment',
      'id': 'friendlyName',
      'dataClass': 'friendlyName',
      'width': '50%'
    },
    {
      'name': '# data elements',
      'id': 'count',
      'dataClass': 'count',
      'width': '45%'
    }
  ];
export const testData: IGridData[] = [
    {
      'id': 'd3bd5dd4-867a-4a2e-8103-f5b6ceaa705b',
      'friendlyName': 'Public Record',
      'type': 'segment',
      'parent': 'a4e87943-24bb-4fd6-ac6b-471bc6796425',
      'transunion': true,
      'models': false,
      'alternate': false,
      'internalName': 'BC3.PUBR.FINAL.V5',
      'datasourceName': 'bc3',
      'tags': [
        'Universal',
        'CreditVision Only'
      ],
      'parentFriendlyName': 'TransUnion (Credit)',
      'count': 10,
      'checked': false,
      'indeterminate': true,
      'creditVisionOnly': 'Yes'
    },
    {
      'id': '7f178246-8ad0-44e1-bfd8-9b1fcc7a971f',
      'friendlyName': 'Collections',
      'type': 'segment',
      'parent': 'a4e87943-24bb-4fd6-ac6b-471bc6796425',
      'transunion': true,
      'models': false,
      'alternate': false,
      'internalName': 'BC3.COLLECTIONS.FINAL.V5',
      'datasourceName': 'bc3',
      'tags': [
        'Universal',
        'CreditVision Only'
      ],
      'parentFriendlyName': 'TransUnion (Credit)',
      'count': 40,
      'checked': false,
      'indeterminate': true,
      'creditVisionOnly': 'Yes'
    },
    {
      'id': '685527a1-becb-4114-b0de-53c99eba1dcf',
      'friendlyName': 'Employment',
      'type': 'segment',
      'parent': 'a4e87943-24bb-4fd6-ac6b-471bc6796425',
      'transunion': true,
      'models': false,
      'alternate': false,
      'internalName': 'BC3.EMPL.FINAL.V5',
      'datasourceName': 'bc3',
      'tags': [
        'Universal',
        'CreditVision Only'
      ],
      'parentFriendlyName': 'TransUnion (Credit)',
      'count': 9,
      'checked': false,
      'indeterminate': false,
      'creditVisionOnly': 'Yes'
    },
    {
      'id': '6150c59d-8af4-42c5-887c-85f56a90698f',
      'friendlyName': 'Person Address',
      'type': 'segment',
      'parent': 'a4e87943-24bb-4fd6-ac6b-471bc6796425',
      'transunion': true,
      'models': false,
      'alternate': false,
      'internalName': 'BC3.PADD.FINAL.V5',
      'datasourceName': 'bc3',
      'tags': [
        'Universal',
        'CreditVision Only'
      ],
      'parentFriendlyName': 'TransUnion (Credit)',
      'count': 6,
      'checked': false,
      'indeterminate': false,
      'creditVisionOnly': 'Yes'
    },
    {
      'id': 'd4920e6c-8d43-496d-bbbd-7c3243985d9f',
      'friendlyName': 'Credit Inquiry',
      'type': 'segment',
      'parent': 'a4e87943-24bb-4fd6-ac6b-471bc6796425',
      'transunion': true,
      'models': false,
      'alternate': false,
      'internalName': 'BC3.CIP.FINAL.V5',
      'datasourceName': 'bc3',
      'tags': [
        'Universal',
        'CreditVision Only'
      ],
      'parentFriendlyName': 'TransUnion (Credit)',
      'count': 10,
      'checked': false,
      'indeterminate': false,
      'creditVisionOnly': 'Yes'
    },
    {
      'id': '988a1eea-dba3-4413-9d28-4b94a25ba5cf',
      'friendlyName': 'Person Name',
      'type': 'segment',
      'parent': 'a4e87943-24bb-4fd6-ac6b-471bc6796425',
      'transunion': true,
      'models': false,
      'alternate': false,
      'internalName': 'BC3.PNME.FINAL.V5',
      'datasourceName': 'bc3',
      'tags': [
        'Universal',
        'CreditVision Only'
      ],
      'parentFriendlyName': 'TransUnion (Credit)',
      'count': 1,
      'checked': false,
      'indeterminate': false,
      'creditVisionOnly': 'Yes'
    },
    {
      'id': '2505d911-f9d7-474a-82b9-d288ab1fe4dc',
      'friendlyName': 'Person',
      'type': 'segment',
      'parent': 'a4e87943-24bb-4fd6-ac6b-471bc6796425',
      'transunion': true,
      'models': false,
      'alternate': false,
      'internalName': 'BC3.PERS.FINAL.V5',
      'datasourceName': 'bc3',
      'tags': [
        'Universal',
        'CreditVision Only'
      ],
      'parentFriendlyName': 'TransUnion (Credit)',
      'count': 5,
      'checked': false,
      'indeterminate': false,
      'creditVisionOnly': 'Yes'
    },
    {
      'id': 'fead3c31-824c-4fd5-ab93-da9f23dd3ab9',
      'friendlyName': 'Account',
      'type': 'segment',
      'parent': 'a4e87943-24bb-4fd6-ac6b-471bc6796425',
      'transunion': true,
      'models': false,
      'alternate': false,
      'internalName': 'BC3.TRADES.FINAL.V5',
      'datasourceName': 'bc3',
      'tags': [
        'Universal',
        'CreditVision Only'
      ],
      'parentFriendlyName': 'TransUnion (Credit)',
      'count': 60,
      'checked': false,
      'indeterminate': false,
      'creditVisionOnly': 'Yes'
    },
    {
      'id': 'bf17ce1d-1f9a-4695-8112-e22efad61f67',
      'friendlyName': 'Account History',
      'type': 'segment',
      'parent': 'a4e87943-24bb-4fd6-ac6b-471bc6796425',
      'transunion': true,
      'models': false,
      'alternate': false,
      'internalName': 'BC3.TRHI.FINAL.V5',
      'datasourceName': 'bc3',
      'tags': [
        'CreditVision Only'
      ],
      'parentFriendlyName': 'TransUnion (Credit)',
      'count': 15,
      'checked': false,
      'indeterminate': false,
      'creditVisionOnly': 'Yes'
    },
    {
      'id': '1ab35731-fa0d-444a-bbbe-463dd9afe425',
      'friendlyName': 'Derived',
      'type': 'segment',
      'parent': 'a4e87943-24bb-4fd6-ac6b-471bc6796425',
      'transunion': true,
      'models': false,
      'alternate': false,
      'internalName': 'BC3.DRVD.FINAL.V5',
      'datasourceName': 'bc3',
      'tags': [
        'Universal',
        'CreditVision Only'
      ],
      'parentFriendlyName': 'TransUnion (Credit)',
      'count': 2,
      'checked': false,
      'indeterminate': false,
      'creditVisionOnly': 'Yes'
    }
  ];
