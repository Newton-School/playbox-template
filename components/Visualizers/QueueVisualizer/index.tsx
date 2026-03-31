"use client"

import { useState } from 'react'
import { NSButton, NSTextField, NSTypography } from '@newtonschool/grauity'
import { useLifecycleEvents, useCommonEventHandlers } from '../../../hooks/useEventTracking'
import styles from './index.module.css'

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<number[]>([])
  const [inputValue, setInputValue] = useState('')
  const [animation, setAnimation] = useState<{ type: 'enqueue' | 'dequeue' | null; element?: number }>({ type: null })

  // Event tracking - Modern approach (replaces manual postMessage calls)
  useLifecycleEvents('queue')
  const { trackClick, trackFormInput, trackAlgorithmStep } = useCommonEventHandlers('queue')

  const enqueue = () => {
    if (!inputValue.trim()) return

    const value = parseInt(inputValue)
    if (isNaN(value)) return

    trackClick('enqueue-clicked', {
      queueSize: queue.length,
      value: value,
      timestamp: Date.now()
    })

    setAnimation({ type: 'enqueue', element: value })

    setTimeout(() => {
      setQueue(prev => {
        const newQueue = [...prev, value];
        setInputValue('');
        setAnimation({ type: null });

        trackAlgorithmStep({
          action: 'enqueue-completed',
          value: value,
          newQueueSize: newQueue.length
        });

        return newQueue;
      });
    }, 500)
  }

  const dequeue = () => {
    if (queue.length === 0) return

    const dequeuedElement = queue[0]

    trackClick('dequeue-clicked', {
      queueSize: queue.length,
      frontElement: dequeuedElement,
      timestamp: Date.now()
    })

    setAnimation({ type: 'dequeue', element: dequeuedElement })

    setTimeout(() => {
      setQueue(prev => prev.slice(1))
      setAnimation({ type: null })

      trackAlgorithmStep({
        action: 'dequeue-completed',
        value: dequeuedElement,
        newQueueSize: queue.length - 1
      })
    }, 500)
  }

  const reset = () => {
    trackClick('reset-clicked', {
      queueSize: queue.length,
      timestamp: Date.now()
    })

    setQueue([])
    setInputValue('')
    setAnimation({ type: null })
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <NSTypography variant="heading-sb-h3" as="h3" className={styles.title}>
          Queue Visualizer
        </NSTypography>
        <NSTypography variant="paragraph-sb-p2" className={styles.description}>
          Visualize FIFO (First In, First Out) operations: Enqueue and Dequeue
        </NSTypography>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlsRow}>
          <div className={styles.inputField}>
            <NSTextField
              name="queueInput"
              label="Enter a number"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setInputValue(value)
                trackFormInput('queue-input-changed', {
                  inputLength: value.length,
                  isValidNumber: !isNaN(parseInt(value)) && value.trim() !== ''
                })
              }}
              placeholder="e.g., 42"
            />
          </div>
          <NSButton
            onClick={enqueue}
            disabled={!inputValue.trim() || animation.type !== null}
            color="brand"
          >
            Enqueue
          </NSButton>
          <NSButton
            onClick={dequeue}
            disabled={queue.length === 0 || animation.type !== null}
            variant="secondary"
          >
            Dequeue
          </NSButton>
          <NSButton onClick={reset} variant="tertiary" color="error">
            Reset
          </NSButton>
        </div>
      </div>

      {/* Queue Visualization */}
      <div className={styles.visualization}>
        <div className={styles.visualizationTitle}>
          <NSTypography variant="heading-sb-h3">
            Queue (FIFO - First In, First Out)
          </NSTypography>
        </div>

        {/* Queue Container */}
        <div className={styles.queueContainer}>
          {/* Front/Rear Labels */}
          <div className={styles.queueLabels}>
            <div className={styles.labelLeft}>
              <NSTypography variant="action-sb-p2" color="brand">
                ← FRONT (Dequeue)
              </NSTypography>
            </div>
            <div className={styles.labelRight}>
              <NSTypography variant="action-sb-p2" color="success">
                REAR (Enqueue) →
              </NSTypography>
            </div>
          </div>

          {/* Queue Elements */}
          <div className={styles.queueElements}>
            <div className={styles.elementsRow}>
              {queue.length === 0 ? (
                <div className={styles.emptyQueue}>
                  <NSTypography variant="paragraph-md-p2" color="secondary">
                    Empty Queue
                  </NSTypography>
                </div>
              ) : (
                queue.map((element, index) => {
                  const elementClasses = [
                    styles.queueElement,
                    index === 0 ? styles.front : '',
                    animation.type === "dequeue" && index === 0 ? styles.dequeuing : ''
                  ].filter(Boolean).join(' ');

                  return (
                    <div
                      key={`${element}-${index}`}
                      className={elementClasses}
                    >
                      {element}
                    </div>
                  );
                })
              )}

              {/* Animation for new element being enqueued */}
              {animation.type === "enqueue" && animation.element && (
                <div className={styles.animationElement}>
                  {animation.element}
                </div>
              )}
            </div>
          </div>

          {/* Queue Info */}
          <div className={styles.queueInfo}>
            <div className={styles.infoItem}>
              <NSTypography variant="action-sb-p2" color="secondary">
                Size
              </NSTypography>
              <NSTypography variant="heading-sb-h4" color="primary">
                {queue.length}
              </NSTypography>
            </div>
            <div className={styles.infoItem}>
              <NSTypography variant="action-sb-p2" color="secondary">
                Front Element
              </NSTypography>
              <NSTypography variant="heading-sb-h4" color="primary">
                {queue.length > 0 ? queue[0] : "-"}
              </NSTypography>
            </div>
            <div className={styles.infoItem}>
              <NSTypography variant="action-sb-p2" color="secondary">
                Rear Element
              </NSTypography>
              <NSTypography variant="heading-sb-h4" color="primary">
                {queue.length > 0 ? queue[queue.length - 1] : "-"}
              </NSTypography>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <NSTypography variant="heading-sb-h4" className={styles.legendTitle}>
          Legend
        </NSTypography>
        <div className={styles.legendGrid}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.front}`}></div>
            <NSTypography variant="paragraph-md-p2">
              Front Element (Next to dequeue)
            </NSTypography>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.enqueue}`}></div>
            <NSTypography variant="paragraph-md-p2">
              New Element (Being enqueued)
            </NSTypography>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.dequeue}`}></div>
            <NSTypography variant="paragraph-md-p2">
              Element Being Dequeued
            </NSTypography>
          </div>
        </div>
      </div>
    </div>
  );
}