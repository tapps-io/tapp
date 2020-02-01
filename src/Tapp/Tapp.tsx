import React, { Component } from 'react';
import s from './Tapp.module.css';

import basicSchema from 'schema/basic-event.json';
import { BasicEvent } from 'schema/basic-event';

import { Container } from '@trutoo/ui-core';

interface TappConfig {
  repeat?: number;
}

interface Props {
  name: string;
  config: TappConfig;
}

/**
 * Basic tapp used as an example for bootstrapping.
 */
export class Tapp extends Component<Props> {
  name = 'Hook';
  subs: { unsubscribe: () => void }[] = [];

  constructor(props: Props) {
    super(props);
    // Reserve an event type to follow a JSON schema ensure correct communication
    if (window.eventBus) window.eventBus.register('tapp:basic', basicSchema);
  }

  componentDidMount() {
    if (window.eventBus) {
      // Listen to event type. The second argument will request a replay of the last detail
      this.subs.push(
        window.eventBus.subscribe<BasicEvent>('tapp:basic', true, detail => {
          if (detail) console.log('Event detail:', detail);
        }),
      );
      // Send details on event channels following JSON schema
      window.eventBus.publish<BasicEvent>('tapp:basic', {
        hook: this.props.name,
      });
    }
  }

  componentWillUnmount() {
    // Remove subscriptions when component unmounts
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Simple functions that capitalizes strings.
   * @param str string to manipulate
   * @returns capitalized string
   */
  public static UpperCase(str: string): string {
    return str.toUpperCase();
  }

  /**
   * Render method called on each update to create some basic text.
   */
  render() {
    return (
      <Container className={`${s.tapp} tu-elevation-1`}>
        This is a tiny app using hook {Tapp.UpperCase(this.props.name).repeat(this.props.config.repeat || 1)}
      </Container>
    );
  }
}
