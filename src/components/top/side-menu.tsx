"use client"

import { useState } from "react"
import { motion, useAnimationControls, AnimatePresence } from "framer-motion"
import { MenuContent } from "./menu-content"

function BurgerBars({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col gap-[5px] lg:gap-[7px] items-center">
      <motion.span
        animate={{ rotate: open ? 45 : 0, y: open ? 12 : 0 }}
        transition={{ duration: 0.3 }}
        className="block h-px w-[18px] lg:w-[25px] bg-black"
      />
      <motion.span
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="block h-px w-[18px] lg:w-[25px] bg-black"
      />
      <motion.span
        animate={{ rotate: open ? -45 : 0, y: open ? -12 : 0 }}
        transition={{ duration: 0.3 }}
        className="block h-px w-[18px] lg:w-[25px] bg-black"
      />
    </div>
  )
}

export function SideMenuButton() {
  const [open, setOpen] = useState(false)
  const btnControls = useAnimationControls()

  const handleOpen = () => {
    setOpen(true)
    btnControls.start({ x: 100, transition: { duration: 0.5 } })
  }
  const handleClose = () => {
    setOpen(false)
    btnControls.start({ x: 0, transition: { duration: 0.5 } })
  }

  return (
    <>
      {/* MENU ボタン */}
      <motion.button
        animate={btnControls}
        whileHover={{ width: 70, paddingRight: 10, transition: { duration: 0.6 } }}
        onClick={handleOpen}
        className="fixed top-[30%] right-0 z-[75] bg-white flex flex-col items-center justify-center gap-4 lg:gap-6 pb-4"
        style={{ width: 30, height: 100 }}
      >
        <BurgerBars open={false} />
        <span
          className="text-[10px] lg:text-[12px] text-black/70 tracking-[1.8px]"
          style={{ transform: "rotate(270deg)", whiteSpace: "nowrap" }}
        >
          MENU
        </span>
      </motion.button>

      {/* CLOSE ボタン */}
      <AnimatePresence>
        {open && (
          <motion.button
            initial={{ x: 100 }}
            animate={{ x: 0, transition: { duration: 0.5 } }}
            exit={{ x: 100, transition: { duration: 0.5 } }}
            whileHover={{ width: 70, paddingRight: 10, transition: { duration: 0.6 } }}
            onClick={handleClose}
            className="fixed top-[30%] right-0 z-[100] bg-white flex flex-col items-center justify-center gap-4 lg:gap-6 pb-4"
            style={{ width: 40, height: 100 }}
          >
            <BurgerBars open={true} />
            <span
              className="text-[10px] lg:text-[12px] text-black/70 tracking-[1.8px]"
              style={{ transform: "rotate(270deg)", whiteSpace: "nowrap" }}
            >
              CLOSE
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* メニューコンテンツ */}
      <AnimatePresence>
        {open && <MenuContent onClose={handleClose} />}
      </AnimatePresence>
    </>
  )
}
