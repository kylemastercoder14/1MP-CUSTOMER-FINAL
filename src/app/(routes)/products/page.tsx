"use client";

import React, { Suspense } from 'react'
import Client from './client'

const Page = () => {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <Client />
    </Suspense>
  )
}

export default Page
