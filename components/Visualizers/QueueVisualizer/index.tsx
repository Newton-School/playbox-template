"use client"

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { NSButton, NSTextField, NSTypography } from '@newtonschool/grauity'
import { useLifecycleEvents, useCommonEventHandlers } from '../../../hooks/useEventTracking'
import styles from './index.module.css'

type QueueItem = { id: number; value: number }
type ServedItem = { id: number; value: number }

const ITEM_SPRING = { type: 'spring' as const, stiffness: 340, damping: 30, mass: 0.9 }
const SERVED_HOLD_MS = 1400

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [served, setServed] = useState<ServedItem | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [totalEnqueued, setTotalEnqueued] = useState(0)
  const [totalDequeued, setTotalDequeued] = useState(0)
  const idRef = useRef(0)
  const servedTimerRef = useRef<number | null>(null)

  useLifecycleEvents('queue')
  const { trackClick, trackFormInput, trackAlgorithmStep } = useCommonEventHandlers('queue')

  useEffect(() => () => {
    if (servedTimerRef.current) window.clearTimeout(servedTimerRef.current)
  }, [])

  const enqueue = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    const value = parseInt(trimmed, 10)
    if (Number.isNaN(value)) return

    trackClick('enqueue-clicked', { queueSize: queue.length, value })

    idRef.current += 1
    const nextItem: QueueItem = { id: idRef.current, value }
    setQueue(prev => {
      const next = [...prev, nextItem]
      trackAlgorithmStep({ action: 'enqueue-completed', value, newQueueSize: next.length })
      return next
    })
    setTotalEnqueued(n => n + 1)
    setInputValue('')
  }

  const dequeue = () => {
    if (queue.length === 0) return
    const front = queue[0]

    trackClick('dequeue-clicked', { queueSize: queue.length, frontElement: front.value })

    setQueue(prev => {
      const next = prev.slice(1)
      trackAlgorithmStep({ action: 'dequeue-completed', value: front.value, newQueueSize: next.length })
      return next
    })
    setTotalDequeued(n => n + 1)

    setServed({ id: front.id, value: front.value })
    if (servedTimerRef.current) window.clearTimeout(servedTimerRef.current)
    servedTimerRef.current = window.setTimeout(() => setServed(null), SERVED_HOLD_MS)
  }

  const reset = () => {
    trackClick('reset-clicked', { queueSize: queue.length })
    if (servedTimerRef.current) window.clearTimeout(servedTimerRef.current)
    setQueue([])
    setServed(null)
    setInputValue('')
    setTotalEnqueued(0)
    setTotalDequeued(0)
  }

  const front = queue[0]
  const rear = queue[queue.length - 1]
  const beltRunning = queue.length > 0

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <NSTypography variant="heading-sb-h3" as="h3" className={styles.title}>
          Queue Visualizer
        </NSTypography>
        <NSTypography variant="paragraph-sb-p2" className={styles.description}>
          Items drop in at the intake, ride a FIFO conveyor belt, and leave through the service tray.
        </NSTypography>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlsRow}>
          <div className={styles.inputField}>
            <NSTextField
              name="queueInput"
              label="Item value"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const v = e.target.value
                setInputValue(v)
                trackFormInput('queue-input-changed', {
                  inputLength: v.length,
                  isValidNumber: !Number.isNaN(parseInt(v, 10)) && v.trim() !== '',
                })
              }}
              placeholder="e.g., 42"
            />
          </div>
          <NSButton onClick={enqueue} disabled={!inputValue.trim()} color="brand" icon="plus">
            Enqueue
          </NSButton>
          <NSButton onClick={dequeue} disabled={queue.length === 0} variant="secondary" icon="arrow-left">
            Dequeue
          </NSButton>
          <NSButton onClick={reset} variant="tertiary" color="error" icon="refresh">
            Reset
          </NSButton>
        </div>
      </div>

      <div className={styles.stage}>
        <div className={styles.zone}>
          <div className={`${styles.zoneLabel} ${styles.zoneLabelSuccess}`}>
            <NSTypography variant="action-sb-p2" color="success">SERVED</NSTypography>
          </div>
          <div className={`${styles.zoneSlot} ${styles.zoneSlotSuccess}`}>
            <AnimatePresence>
              {served && (
                <motion.div
                  key={served.id}
                  className={`${styles.package} ${styles.packageServed}`}
                  initial={{ opacity: 1, scale: 1, rotate: 0 }}
                  animate={{ opacity: [1, 1, 0], scale: [1, 1.08, 0.85], rotate: [0, -3, 0] }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: SERVED_HOLD_MS / 1000, times: [0, 0.35, 1] }}
                >
                  {served.value}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className={styles.zoneCaption}>
            <NSTypography variant="paragraph-md-p3" color="secondary">Front exits here</NSTypography>
          </div>
        </div>

        <div className={styles.beltWrapper}>
          <div className={styles.beltEnds}>
            <span className={styles.beltRoller} aria-hidden />
            <span className={styles.beltRoller} aria-hidden />
          </div>
          <div className={`${styles.belt} ${beltRunning ? styles.beltRunning : ''}`}>
            <div className={styles.beltItems}>
              {queue.length === 0 && (
                <div className={styles.beltEmpty}>
                  <NSTypography variant="paragraph-md-p2" color="secondary">
                    Belt is idle — enqueue an item to start the line
                  </NSTypography>
                </div>
              )}
              <AnimatePresence mode="popLayout" initial={false}>
                {queue.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    className={`${styles.package} ${index === 0 ? styles.packageFront : ''}`}
                    initial={{ opacity: 0, x: 80, y: -48, scale: 0.7 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -100, y: 8, scale: 0.6 }}
                    transition={ITEM_SPRING}
                  >
                    {item.value}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className={styles.beltCaption}>
            <NSTypography variant="action-sb-p2" color="brand">← FRONT</NSTypography>
            <NSTypography variant="action-sb-p2" color="secondary">
              {queue.length} {queue.length === 1 ? 'item' : 'items'} on belt
            </NSTypography>
            <NSTypography variant="action-sb-p2" color="success">REAR →</NSTypography>
          </div>
        </div>

        <div className={styles.zone}>
          <div className={`${styles.zoneLabel} ${styles.zoneLabelBrand}`}>
            <NSTypography variant="action-sb-p2" color="brand">INTAKE</NSTypography>
          </div>
          <div className={`${styles.zoneSlot} ${styles.zoneSlotBrand}`}>
            <motion.div
              className={styles.chuteArrow}
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            >
              ▼
            </motion.div>
          </div>
          <div className={styles.zoneCaption}>
            <NSTypography variant="paragraph-md-p3" color="secondary">New items drop in here</NSTypography>
          </div>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <NSTypography variant="action-sb-p2" color="secondary">Size</NSTypography>
          <NSTypography variant="heading-sb-h4" color="primary">{queue.length}</NSTypography>
        </div>
        <div className={styles.stat}>
          <NSTypography variant="action-sb-p2" color="secondary">Front</NSTypography>
          <NSTypography variant="heading-sb-h4" color="brand">{front ? front.value : '—'}</NSTypography>
        </div>
        <div className={styles.stat}>
          <NSTypography variant="action-sb-p2" color="secondary">Rear</NSTypography>
          <NSTypography variant="heading-sb-h4" color="primary">{rear ? rear.value : '—'}</NSTypography>
        </div>
        <div className={styles.stat}>
          <NSTypography variant="action-sb-p2" color="secondary">Enqueued</NSTypography>
          <NSTypography variant="heading-sb-h4" color="success">{totalEnqueued}</NSTypography>
        </div>
        <div className={styles.stat}>
          <NSTypography variant="action-sb-p2" color="secondary">Dequeued</NSTypography>
          <NSTypography variant="heading-sb-h4" color="error">{totalDequeued}</NSTypography>
        </div>
      </div>
    </div>
  )
}
