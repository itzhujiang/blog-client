import DynamicsFormComp from './dynamicsForm/index.vue';
import FormComp from './form/index.vue';
import PopUpFormBoxComp from './popUpFormBox/index.vue';
import PreviewDialogComp from './previewDialog/index.vue';
import RemoteSearchSelectComp from './remoteSearchSelect/index.vue';
import TableComp from './table/index.vue';
import SearchComp from './table/tableSearch/index.vue';
import UploadComp from './upload/index.vue';
import type { TableSearch } from './utils/searchTypes';
import type { TableConfig, RequestType, ResponseType, ResponseFormatType } from './utils/tableType';
import type {
  ModelValueType as UploadModelValueType,
  UploadResponseType,
} from './utils/uploadType';
import {
  createTableConfig,
  createFormConfig,
  createPopUpFormConfig,
  switchType,
  createDynamicsFormConfig,
} from './utils/utils';

export {
  TableComp,
  createTableConfig,
  FormComp,
  createFormConfig,
  PopUpFormBoxComp,
  UploadComp,
  SearchComp,
  createPopUpFormConfig,
  switchType,
  PreviewDialogComp,
  DynamicsFormComp,
  createDynamicsFormConfig,
  RemoteSearchSelectComp,
};

export type {
  TableConfig,
  TableSearch,
  RequestType,
  ResponseType,
  ResponseFormatType,
  UploadModelValueType,
  UploadResponseType,
};
