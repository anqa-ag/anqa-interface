import { WalletName } from "@aptos-labs/wallet-adapter-react";
import { Button, Image, Modal, ModalContent, Spacer } from "@nextui-org/react";
import { isDesktop } from "react-device-detect";
import {
    aptosConnectWallet,
    martianWallet,
    nightlyWallet,
    okxWallet,
    petraWallet,
    pontemWallet,
} from "../../constants";
import useAnqaWallet from "../../hooks/useAnqaWallet.ts";
import { CloseIcon } from "../Icons";
import { BodyB2, TitleT1, TitleT2, TitleT5 } from "../Texts";

export default function ModalConnectWallet({
    isOpen,
    onClose,
    onOpenChange,
}: {
    isOpen: boolean;
    onClose: () => void;
    onOpenChange: () => void;
}) {
    const { connect } = useAnqaWallet();

    const onConnect = (wantedProvider: WalletName) => () => {
        connect(wantedProvider);
        onClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="blur"
                hideCloseButton
            >
                <ModalContent className="max-w-[420px] bg-buttonDisabled p-4 text-foreground dark">
                    {(onClose) => (
                        <>
                            <div className="flex items-center justify-between">
                                <TitleT1>Welcome to Anqa</TitleT1>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    className="h-[20px] w-[20px] min-w-fit p-0"
                                    onPress={onClose}
                                >
                                    <CloseIcon size={20} />
                                </Button>
                            </div>

                            <Spacer y={4} />

                            <BodyB2 className="text-buttonSecondary">
                                To get started, please connect your wallet
                            </BodyB2>

                            <Spacer y={4} />

                            <div className="flex flex-col gap-3">
                                {/* GOOGLE */}
                                <div className="flex w-full flex-col gap-1">
                                    <Button
                                        className="flex items-center justify-between rounded bg-background px-4 py-3"
                                        onPress={onConnect(
                                            aptosConnectWallet.name as any,
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Image
                                                width={20}
                                                src="/images/google.png"
                                            />
                                            <TitleT2>Google</TitleT2>
                                        </div>
                                        {
                                            <div className="flex items-center gap-2">
                                                <div className="h-[6.67px] w-[6.67px] rounded-full bg-buttonGreen"></div>
                                                <TitleT5>Detected</TitleT5>
                                            </div>
                                        }
                                    </Button>
                                </div>

                                {/* Nightly */}
                                <div className="flex w-full flex-col gap-1">
                                    <Button
                                      className="flex items-center justify-between rounded bg-background px-4 py-3"
                                      onPress={onConnect(nightlyWallet.name)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Image
                                              width={20}
                                              src="/images/nightly.png"
                                            />
                                            <TitleT2>Nightly</TitleT2>
                                        </div>
                                        {window.nightly && (
                                          <div className="flex items-center gap-2">
                                              <div className="h-[6.67px] w-[6.67px] rounded-full bg-buttonGreen"></div>
                                              <TitleT5>Detected</TitleT5>
                                          </div>
                                        )}
                                    </Button>
                                </div>

                                {/* PETRA */}
                                <div className="flex w-full flex-col gap-1">
                                    <Button
                                        className="flex items-center justify-between rounded bg-background px-4 py-3"
                                        onPress={onConnect(petraWallet.name)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Image
                                                width={20}
                                                src="/images/petra.svg"
                                            />
                                            <TitleT2>Petra</TitleT2>
                                        </div>
                                        {window.aptos && (
                                            <div className="flex items-center gap-2">
                                                <div className="h-[6.67px] w-[6.67px] rounded-full bg-buttonGreen"></div>
                                                <TitleT5>Detected</TitleT5>
                                            </div>
                                        )}
                                    </Button>
                                </div>

                                {/* MARTIAN */}
                                {isDesktop && (
                                    <>
                                        <div className="flex w-full flex-col gap-1">
                                            <Button
                                                className="flex w-full items-center justify-between rounded bg-background px-4 py-3"
                                                onPress={onConnect(
                                                    martianWallet.name,
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        width={20}
                                                        src="/images/martian.jpeg"
                                                    />
                                                    <TitleT2>Martian</TitleT2>
                                                </div>
                                                {window.martian && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-[6.67px] w-[6.67px] rounded-full bg-buttonGreen"></div>
                                                        <TitleT5>
                                                            Detected
                                                        </TitleT5>
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* PONTEM */}
                                <div className="flex w-full flex-col gap-1">
                                    <Button
                                        className="flex items-center justify-between rounded bg-background px-4 py-3"
                                        onPress={onConnect(pontemWallet.name)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Image
                                                width={20}
                                                src="/images/pontem.svg"
                                            />
                                            <TitleT2>Pontem</TitleT2>
                                        </div>
                                        {window.pontem && (
                                            <div className="flex items-center gap-2">
                                                <div className="h-[6.67px] w-[6.67px] rounded-full bg-buttonGreen"></div>
                                                <TitleT5>Detected</TitleT5>
                                            </div>
                                        )}
                                    </Button>
                                </div>

                                {/* OKX */}
                                <div className="flex w-full flex-col gap-1">
                                    <Button
                                        className="flex items-center justify-between rounded bg-background px-4 py-3"
                                        onPress={onConnect(okxWallet.name)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Image
                                                width={20}
                                                src="/images/okx.png"
                                            />
                                            <TitleT2>OKX Wallet</TitleT2>
                                        </div>
                                        {window.okxwallet && (
                                            <div className="flex items-center gap-2">
                                                <div className="h-[6.67px] w-[6.67px] rounded-full bg-buttonGreen"></div>
                                                <TitleT5>Detected</TitleT5>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
