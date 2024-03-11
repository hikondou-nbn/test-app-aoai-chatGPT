import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import Contoso from "../../assets/Contoso.svg";
import { CopyRegular } from "@fluentui/react-icons";
import { Dialog, Stack, TextField } from "@fluentui/react";
import { useContext, useEffect, useState } from "react";
import { HistoryButton, ShareButton, ChatVersionButton } from "../../components/common/Button";
import { AppStateContext } from "../../state/AppProvider";
import { CosmosDBStatus, ChatVersionSelectStatus } from "../../api";

const Layout = () => {
    const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
    const [copyClicked, setCopyClicked] = useState<boolean>(false);
    const [copyText, setCopyText] = useState<string>("Copy URL");
    const [shareLabel, setShareLabel] = useState<string | undefined>("Share");
    const [hideHistoryLabel, setHideHistoryLabel] = useState<string>("Hide chat history");
    const [showHistoryLabel, setShowHistoryLabel] = useState<string>("Show chat history");
    const appStateContext = useContext(AppStateContext)
    const ui = appStateContext?.state.frontendSettings?.ui;

    const handleShareClick = () => {
        setIsSharePanelOpen(true);
    };

    const handleSharePanelDismiss = () => {
        setIsSharePanelOpen(false);
        setCopyClicked(false);
        setCopyText("Copy URL");
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopyClicked(true);
    };

    const handleHistoryClick = () => {
        appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
    };

    //20240226 add_start バージョン選択ボタンクリックの処理
    const handleChatVersionClick = () => {
        appStateContext?.dispatch({ type: 'TOGGLE_CHAT_VERSION'})
    }
    //20240226 add_end バージョン選択ボタンクリックの処理

    useEffect(() => {
        if (copyClicked) {
            setCopyText("Copied URL");
        }
    }, [copyClicked]);

    useEffect(() => { }, [appStateContext?.state.isCosmosDBAvailable.status]);

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 480) {
            setShareLabel(undefined)
            setHideHistoryLabel("Hide history")
            setShowHistoryLabel("Show history")
          } else {
            setShareLabel("Share")
            setHideHistoryLabel("Hide chat history")
            setShowHistoryLabel("Show chat history")
          }
        };
    
        window.addEventListener('resize', handleResize);
        handleResize();
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
                    <Stack horizontal verticalAlign="center">
                        <img
                            src={ui?.logo ? ui.logo : Contoso}
                            className={styles.headerIcon}
                            aria-hidden="true"
                        />
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h1 className={styles.headerTitle}>{ui?.title}</h1>
                        </Link>
                    </Stack>
                    <Stack horizontal className={styles.push}>
                        <a href="https://nbn061.sharepoint.com/sites/wolfychat" target="_blank" rel="noopener nofeferrer" className={styles.guidelines}>
                            活用サイト
                        </a>
                        <a href="https://nbn061.sharepoint.com/sites/wolfychat/Lists/prompts/TOP.aspx" target="_blank" rel="noopener nofeferrer" className={styles.guidelines}>
                            プロンプト集
                        </a>
                        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=vJHkAvf9u0ixOSAD1uBwKBGK8iF8qjpHjKSt89NfhrtUNlBMWlRJS1YxMU9XNVRSRDlROUpBUk0xUC4u" target="_blank" rel="noopener nofeferrer" className={styles.guidelines}>
                            プロンプト投稿
                        </a>
                        <a href="https://nbn061.sharepoint.com/:b:/s/wolfychat/EZXoAngEiQ5IpdgT1ee7Em0BRFkuXWLtkG2NQorZPSN-2w?e=W8yGwL" target="_blank" rel="noopener nofeferrer" className={styles.guidelines}>
                            マニュアル
                        </a>
                        <a href="https://nbn061.sharepoint.com/:b:/s/wolfychat/EaF-XawFnFJIiMI7bOEPxeUBNdTWgd_jphKWg3ldH1VVaQ?e=Tdpbmk" target="_blank" rel="noopener nofeferrer" className={styles.guidelines}>
                            ガイドライン
                        </a>
                    </Stack>
                    <Stack horizontal tokens={{ childrenGap: 4 }}>
                        {ui?.show_chatVersion_Button &&
                            <ChatVersionButton onClick={handleChatVersionClick} text={appStateContext?.state?.isChatGPTVersion ? "GPT4" : "GPT3-5"}/> 
                        }
                        {(appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured) &&
                            <HistoryButton onClick={handleHistoryClick} text={appStateContext?.state?.isChatHistoryOpen ? hideHistoryLabel : showHistoryLabel} />
                        }
                        {ui?.show_share_button &&
                            <ShareButton onClick={handleShareClick} text={shareLabel} />
                        }
                    </Stack>
                </Stack>
            </header>
            <Outlet />
            <Dialog
                onDismiss={handleSharePanelDismiss}
                hidden={!isSharePanelOpen}
                styles={{

                    main: [{
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                maxWidth: '600px',
                                background: "#FFFFFF",
                                boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                                borderRadius: "8px",
                                maxHeight: '200px',
                                minHeight: '100px',
                            }
                        }
                    }]
                }}
                dialogContentProps={{
                    title: "Share the web app",
                    showCloseButton: true
                }}
            >
                <Stack horizontal verticalAlign="center" style={{ gap: "8px" }}>
                    <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly />
                    <div
                        className={styles.copyButtonContainer}
                        role="button"
                        tabIndex={0}
                        aria-label="Copy"
                        onClick={handleCopyClick}
                        onKeyDown={e => e.key === "Enter" || e.key === " " ? handleCopyClick() : null}
                    >
                        <CopyRegular className={styles.copyButton} />
                        <span className={styles.copyButtonText}>{copyText}</span>
                    </div>
                </Stack>
            </Dialog>
        </div>
    );
};

export default Layout;
