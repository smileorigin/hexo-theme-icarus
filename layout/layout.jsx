const { Component } = require('inferno');
const classname = require('hexo-component-inferno/lib/util/classname');
const view = require('hexo-component-inferno/lib/core/view');
const Head = require('./common/head');
const Navbar = require('./common/navbar');
const Widgets = require('./common/widgets');
const Footer = require('./common/footer');
const Scripts = require('./common/scripts');
const Search = require('./common/search');

module.exports = class extends Component {
    render() {
        const { env, site, config, page, helper, body, is_home, is_post } = this.props;

        const language = page.lang || page.language || config.language;
        const columnCount = Widgets.getColumnCount(config.widgets);
        const contentClass = () => {
            const columnCountMap = ['is-12-tablet is-9-desktop is-9-widescreen ', 'is-12', 'is-8-tablet is-8-desktop is-8-widescreen', 'is-8-tablet is-8-desktop is-6-widescreen']
            if (is_home()) {
                return columnCountMap[columnCount];
            } else if (is_post() && config.toc) {
                return columnCountMap[0];
            } else {
                return columnCountMap[1];
            }
        };

        return <html lang={language ? language.substr(0, 2) : ''}>
            <Head env={env} site={site} config={config} helper={helper} page={page} />
            <body class={`is-${columnCount}-column`}>
                <script type="text/javascript" src="/js/dark.js"></script>
                <Navbar config={config} helper={helper} page={page} />
                <section class="section">
                    <div class="container">
                        <div class="columns">
                            <div class={`column order-2 column-main ${contentClass()}`}
                                dangerouslySetInnerHTML={{ __html: body }}></div>
                            {is_home() ?
                                <Fragment>
                                    <Widgets site={site} config={config} helper={helper} page={page} position={'left'} />
                                </Fragment>
                            : null}
                            {(() => {
                                if (config.toc) {
                                    config.widgets = [{type: 'toc', position: 'right', sticky: true}]
                                    return <Fragment>
                                        <Widgets site={site} config={config} helper={helper} page={page} position={'right'} is_post={is_post()} />
                                        </Fragment>
                                }
                            })()}
                        </div>
                    </div>
                </section>
                <Footer config={config} helper={helper} />
                <Scripts site={site} config={config} helper={helper} page={page} />
                <Search config={config} helper={helper} />
            </body>
        </html>;
    }
};
