import './version-tip-dialog.css';
export declare const versionTipDialog: (params: {
    title?: string | undefined;
    description?: string | undefined;
    buttonText?: string | undefined;
    cancelButtonText?: string | undefined;
    cancelMode?: string | undefined;
    imageUrl?: string | undefined;
    rocketColor?: string | undefined;
    primaryColor?: string | undefined;
    buttonStyle?: string | undefined;
    newVersion?: string | undefined;
    needRefresh?: boolean | undefined;
    onRefresh?: ((event: any) => void) | undefined;
    onCancel?: ((event: any) => void) | undefined;
}) => void;
