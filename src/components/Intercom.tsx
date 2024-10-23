import { IntercomProvider } from "react-use-intercom";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export function Intercom({ children }) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  if (!customFields.INTERCOM_APP_ID) {
    return children;
  }

  return (
    <IntercomProvider
      appId={customFields.INTERCOM_APP_ID as string}
      autoBoot
      autoBootProps={{
        customLauncherSelector: ".intercom-launcher",
      }}
    >
      {children}
    </IntercomProvider>
  );
}
