import Cropper from 'cropperjs';

interface ToolbarOptions {
  action: string;
  arg?: number;
  icon: string;
  labelI18n: string;
  side: string;
}

const DEFAULT_CROPPER_OPTIONS: Cropper.Options = {
  aspectRatio: 1,
  autoCrop: true,
  background: true,
  center: true,
  checkCrossOrigin: true,
  checkOrientation: true,
  cropBoxMovable: true,
  cropBoxResizable: true,
  guides: true,
  highlight: true,
  modal: true,
  movable: true,
  responsive: true,
  restore: true,
  rotatable: true,
  scalable: true,
  toggleDragModeOnDblclick: true,
  zoomable: true,
  zoomOnTouch: true,
  zoomOnWheel: true,
};

const TOOLBAR_BUTTON_LIST: ToolbarOptions[] = [
  {
    action: 'reset',
    icon: 'ant-design:reload-outlined',
    labelI18n: 'component.cropper.button.reset',
    side: 'bottom',
  },
  {
    action: 'rotate',
    arg: -45,
    icon: 'ant-design:rotate-left-outlined',
    labelI18n: 'component.cropper.button.rotateLeft',
    side: 'bottom',
  },
  {
    action: 'rotate',
    arg: 45,
    icon: 'ant-design:rotate-right-outlined',
    labelI18n: 'component.cropper.button.rotateRight',
    side: 'bottom',
  },
  {
    action: 'scaleX',
    icon: 'vaadin:arrows-long-h',
    labelI18n: 'component.cropper.button.scale_x',
    side: 'bottom',
  },
  {
    action: 'scaleY',
    icon: 'vaadin:arrows-long-v',
    labelI18n: 'component.cropper.button.scale_y',
    side: 'bottom',
  },
  {
    action: 'zoom',
    arg: 0.1,
    icon: 'ant-design:zoom-in-outlined',
    labelI18n: 'component.cropper.button.zoomIn',
    side: 'bottom',
  },
  {
    action: 'zoom',
    arg: -0.1,
    icon: 'ant-design:zoom-out-outlined',
    labelI18n: 'component.cropper.button.zoomOut',
    side: 'bottom',
  },
];

export { DEFAULT_CROPPER_OPTIONS, TOOLBAR_BUTTON_LIST };
