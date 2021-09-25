import React, { Component } from "react";
import "./Templates.sass";
import history from "../history";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default class Privacy extends Component {
    render() {
        return (
            <div id="privacy" className="page page-privacy">
                <div className="col-pageHeader">
                    <button className="btn-legalsBack btn-white-blue" onClick={() => !localStorage.getItem('bearertoken') ? history.push("/login") : history.push("/")}><FontAwesomeIcon icon={faChevronLeft}/></button>
                    <h2 className="pageHeader">Datenschutz</h2>
                </div>
                <div className="px-5 pb-5">
                    <br/>
                    <br/>
                    <h4>Grundlegendes</h4>
                    <p>Diese Datenschutzerklärung soll die Nutzer dieser Website über die Art, den Umfang und den Zweck der Erhebung und Verwendung personenbezogener Daten durch den Websitebetreiber, "Christian Immanuel Fischer, Teterower Ring 110, 12619 Berlin" informieren.</p>
                    <p>Der Websitebetreiber nimmt Ihren Datenschutz sehr ernst und behandelt Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Vorschriften. Da durch neue Technologien und die ständige Weiterentwicklung dieser Webseite Änderungen an dieser Datenschutzerklärung vorgenommen werden können, empfehlen wir Ihnen sich die Datenschutzerklärung in regelmäßigen Abständen wieder durchzulesen.</p>
                    <p>Der Websitebetreiber nimmt Ihren Datenschutz sehr ernst und behandelt Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Vorschriften. Da durch neue Technologien und die ständige Weiterentwicklung dieser Webseite Änderungen an dieser Datenschutzerklärung vorgenommen werden können, empfehlen wir Ihnen sich die Datenschutzerklärung in regelmäßigen Abständen wieder durchzulesen.</p>
                    <br/>
                    <h4>Zugriffsdaten</h4>
                    <p>Wir, der Websitebetreiber bzw. Seitenprovider, erheben aufgrund unseres berechtigten Interesses (s. Art. 6 Abs. 1 lit. f. DSGVO) Daten über Zugriffe auf die Website und speichern diese als „Server-Logfiles“ auf dem Server der Website ab. Folgende Daten werden so protokolliert:</p>
                    <li>Besuchte Website</li>
                    <li>Uhrzeit zumZeitpunkt des Zugriffes</li>
                    <li>Menge der gesendeten Daten in Byte</li>
                    <li>Quelle/Verweis, von welchem Sie auf die Seite gelangten</li>
                    <li>Verwendeter Browser</li>
                    <li>Verwendetes Betriebssystem</li>
                    <p>Die Server-Logfiles werden für maximal 7 Tage gespeichert und anschließend gelöscht. Die Speicherung der Daten erfolgt aus Sicherheitsgründen, um z. B. Missbrauchsfälle aufklären zu können. Müssen Daten aus Beweisgründen aufgehoben werden, sind sie solange von der Löschung ausgenommen bis der Vorfall endgültig geklärt ist.</p>
                    <br/>
                    <h4>Reichweitenmessung & Cookies</h4>
                    <p>Diese Website verwendet Cookies zur pseudonymisierten Reichweitenmessung, die entweder von unserem Server oder dem Server Dritter an den Browser des Nutzers
                        Muster von datenschutz.orgübertragen werden. Bei Cookies handelt es sich um kleine Dateien, welche auf Ihrem Endgerät gespeichert werden. Ihr Browser greift auf diese Dateien zu. Durch den Einsatz von Cookies erhöht sich die Benutzerfreundlichkeit und Sicherheit dieser Website.Falls Sie nicht möchten, dass Cookies zur Reichweitenmessung auf Ihrem Endgerät gespeichert werden, können Sie dem Einsatz dieser Dateien hier widersprechen:</p>
                    <li>Cookie-Deaktivierungsseite der Netzwerkwerbeinitiative: <a href="http://optout.networkadvertising.org/?c=1#!/">http://optout.networkadvertising.org/?c=1#!/</a></li>
                    <li>Cookie-Deaktivierungsseite der US-amerikanischen Website: <a href="http://optout.aboutads.info/?c=2#!/">http://optout.aboutads.info/?c=2#!/</a></li>
                    <li>Cookie-Deaktivierungsseite der europäischen Website: <a href="http://optout.networkadvertising.org/?c=1#!/">http://optout.networkadvertising.org/?c=1#!/</a></li>
                    <p>Gängige Browser bieten die Einstellungsoption, Cookies nicht zuzulassen. Hinweis: Es ist nicht gewährleistet, dass Sie auf alle Funktionen dieser Website ohne Einschränkungen zugreifen können, wenn Sie entsprechende Einstellungen vornehmen.</p>
                    <p>Erfassung und Verarbeitung personenbezogener Daten</p>
                    <p>Der Websitebetreiber erhebt, nutzt und gibt Ihre personenbezogenen Daten nur dann weiter, wenn dies im gesetzlichen Rahmen erlaubt ist oder Sie in die Datenerhebung einwilligen.Als personenbezogene Daten gelten sämtliche Informationen, welche dazu dienen, Ihre Person zu bestimmen und welche zu Ihnen zurückverfolgt werden können –also beispielsweise Ihr Name, Ihre E-Mail-Adresse und Telefonnummer.</p>
                    <p>Diese Websitekönnen Sie auch besuchen, ohne Angaben zu Ihrer Person zu machen. Zur Verbesserung unseres Online-Angebotes speichern wir jedoch (ohne Personenbezug) Ihre Zugriffsdaten auf diese Website. Zu diesen Zugriffsdaten gehören z. B. die von Ihnen angeforderte Datei oder der Name Ihres Internet-Providers. Durch die Anonymisierung der Daten sind Rückschlüsse auf Ihre Person nicht möglich. </p>
                    <br/>
                    <h4>Registrierung auf der Webseite</h4>
                    <p>a) Zum Zweck Ihnen die Funktionalitäten unserer Webseite, die einer Registrierung bedürfen, wie etwa das Nutzerportal oder die Möglichkeit, Kommentare auf der Webseite zu hinterlassen, zugänglich und nutzbar zu machen, verarbeiten wir IP-Adressen, Vorname, Nachname, Anschrift und Land, E-Mail Adresse, Bankverbindungsdaten, Finanzamt und die Steueridentifikationsnummer oder eine vergleichbare Information zur Unternehmensidentifikation, sowie weitere von ihnen angegebene Daten.</p>
                    <p>Diese Verarbeitung ist zur Ermöglichung der Nutzung einzelner Funktionalitäten unserer Webseite erforderlich (Art. 6 Abs. 1 lit. b DSGVO). Für Personen, die nicht Vertragspartei, sondern Vertreter ihres Unternehmens sind, ist die Rechtsgrundlage der Datenverarbeitung Art. 6 Abs. 1 lit. f DSGVO.</p>
                    <p>Wir werden die personenbezogenen Daten speichern bis Sie die Löschung Ihres Accounts verlangen. Danach wird die Verarbeitung der Daten beschränkt und nicht weiter zur Identifikation und für den Zugang zu Funktionen der Webseite, die eine Registrierung erfordern, genutzt.</p>
                    <p>Personen, die ihr Unternehmen vertreten, haben das Recht der Verarbeitung ihrer Daten nach Maßgabe der Ziffer 4.2.3. zu widersprechen.</p>

                    <br/>
                    <h4>Umgang mit Kontaktdaten</h4>
                    <p>Nehmen Sie mit uns als Websitebetreiber durch die angebotenen Kontaktmöglichkeiten Verbindung auf, werden Ihre Angaben gespeichert, damit auf diese zur Bearbeitung und Beantwortung Ihrer Anfrage zurückgegriffen werden kann. Ohne Ihre Einwilligung werden diese Daten nicht an Dritte weitergegeben.</p>
                    <br/>
                    <h4>Umgang mit Kommentaren und Beiträgen</h4>
                    <p>Hinterlassen Sie auf dieser Website einen Beitrag oder Kommentar, wird Ihre IP-Adresse gespeichert. Dies erfolgt aufgrund unserer berechtigten Interessen im Sinne des Art. 6 Abs. 1 lit. f. DSGVO und dient der Sicherheit von uns als Websitebetreiber: Denn sollte Ihr Kommentar gegen geltendes Recht verstoßen, können wir dafür belangt werden, weshalb wir ein Interesse an der Identität des Kommentar-bzw. Beitragsautors haben.</p>
                    <br/>
                    <h4>Rechte des Nutzers</h4>
                    <p>Sie haben als Nutzer das Recht, auf Antrag eine kostenlose Auskunft darüber zu erhalten, welchepersonenbezogenen Daten über Sie gespeichert wurden. Sie haben außerdem das Recht auf Berichtigung falscher Daten und auf die Verarbeitungseinschränkung oder Löschung Ihrer personenbezogenen Daten. Falls zutreffend, können Sie auch Ihr Recht auf Datenportabilität geltend machen. Sollten Sie annehmen, dass Ihre Daten unrechtmäßig verarbeitet wurden, können Sie eine Beschwerde bei der zuständigen Aufsichtsbehörde einreichen.</p>
                    <br/>
                    <h4>Löschung von Daten</h4>
                    <p>Sofern Ihr Wunsch nicht mit einer gesetzlichen Pflicht zur Aufbewahrung von Daten (z. B. Vorratsdatenspeicherung) kollidiert, haben Sie ein Anrecht auf Löschung Ihrer Daten. Von uns gespeicherte Daten werden, sollten sie für ihre Zweckbestimmung nicht mehr vonnöten sein und es keine gesetzlichen Aufbewahrungsfristen geben, gelöscht. Falls eine Löschung nicht durchgeführt werden kann, da die Daten für zulässige gesetzliche Zwecke erforderlich sind, erfolgt eine Einschränkung der Datenverarbeitung. In diesem Fall werden die Daten gesperrt und nicht für andere Zwecke verarbeitet.</p>
                    <br/>
                    <h4>Widerspruchsrecht</h4>
                    <p>Nutzer dieser Webseite können von ihrem Widerspruchsrecht Gebrauch machen und der Verarbeitung ihrer personenbezogenen Daten zu jeder Zeit widersprechen. </p>
                    <p>Wenn Sie eine Berichtigung, Sperrung, Löschung oder Auskunft über die zu Ihrer Person gespeicherten personenbezogenen Daten wünschen oder Fragen bzgl. der Erhebung, Verarbeitung oder Verwendung Ihrer personenbezogenen Daten haben oder erteilte Einwilligungen widerrufen möchten, wenden Sie sich bitte an folgende E-Mail-Adresse: mail@christianimmanuel.de</p>

                </div>
            </div>
        );
    }
}
