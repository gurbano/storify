package eu.europa.ec.agri.jcore.testopsis;

import com.vaadin.ui.Label;
import com.vaadin.ui.UI;
import eu.europa.ec.agri.jcore.opsis.push.PushComponent;
import eu.europa.ec.agri.jcore.opsis.push.PushComponentRegistry;
import eu.europa.ec.agri.jcore.opsis.push.PushEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;

/**
 * @author <a href="thomas.frezel@ext.ec.europa.eu">Thomas Frezel</a>
 * @version $Id$
 */
@Configurable(preConstruction = true)
public class PushLabel extends Label implements PushComponent {

    private static final Logger LOGGER = LoggerFactory.getLogger(PushLabel.class);

    @Autowired
    private PushComponentRegistry registry;

    @Override
    public void detach() {
        registry.deregister(this);
        super.detach();
    }

    @Override
    public void attach() {
        super.attach();
        registry.register(this, Opsis3UI.getCurrent());
    }

    @Override
    public void push(PushEvent pushEvent, UI ui) {
        ui.access(new Runnable() {
            @Override
            public void run() {
                setCaption(Long.toString(System.currentTimeMillis()));
            }
        });
    }

    @Override
    public boolean accepts(PushEvent pushEvent) {
        return true;
    }
}
