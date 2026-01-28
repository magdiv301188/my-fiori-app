/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["resource/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
