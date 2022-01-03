import * as React from 'react';
import Tab from './tab';

const TabsContainer = (props) => {
  const [activeTab, setActiveTab] = React.useState<string>(
    props.children[0].props.label
  );
  const { children } = props;

  const onClickTabItem = (tab) => setActiveTab(tab);

  return (
    <div className="tabs">
      <ol className="border-solid border-b pl-0">
        {children.map((child) => {
          const { label, onClick } = child.props;
          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              onClick={onClick || onClickTabItem}
            />
          );
        })}
      </ol>
      <div className="tab-content">
        {children.map((child) => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
};

export default TabsContainer;
